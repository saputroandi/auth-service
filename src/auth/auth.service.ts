import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(dto: AuthDto): Promise<Tokens> {
    // generate password hash
    const hashPassword = await argon.hash(dto.password);

    try {
      // save new user in the db
      const user = await this.prisma.user.create({
        data: { email: dto.email, password: hashPassword },
      });

      // delete user password
      delete user.password;
      delete user.hash_refresh_token;

      // create tokens
      const { access_token, refresh_token } = await this.getTokens(user);

      // update refresh token for db
      // await this.updateHashRefreshToken(user.id, refresh_token);

      // return both tokens
      return { access_token, refresh_token };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Credential already taken');
      }

      throw error;
    }
  }

  async signIn(dto: AuthDto): Promise<Tokens> {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credential are incorrect');

    // match password
    const pwMatch = await argon.verify(user.password, dto.password);
    // if password not match throw exception
    if (!pwMatch) throw new ForbiddenException('Credential are incorrect');

    // create tokens
    const { access_token, refresh_token } = await this.getTokens(user);

    // update refresh token for db
    await this.updateHashRefreshToken(user.id, refresh_token);

    // return both tokens
    return { access_token, refresh_token };
  }

  async refreshTokens(user_id: string, refresh_token: string): Promise<Tokens> {
    // find user and check if refresh token avaible, if not throw error
    const user = await this.prisma.user.findUnique({ where: { id: user_id } });

    if (!user || !user.hash_refresh_token)
      throw new ForbiddenException('Access denied');

    // match refresh token from db if not match throw error
    const matchRefreshToken = await argon.verify(
      user.hash_refresh_token,
      refresh_token,
    );

    if (!matchRefreshToken) throw new ForbiddenException('Access denied');

    // create new access token and update refresh token inside db
    const newTokens = await this.getTokens(user);
    await this.updateHashRefreshToken(user.id, newTokens.refresh_token);

    // return both tokens
    return newTokens;
  }

  async logout(user_id: string): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: user_id,
      },
      data: {
        hash_refresh_token: null,
      },
    });

    return true;
  }

  private async updateHashRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<void> {
    const hashRefreshToken = await argon.hash(refresh_token);

    await this.prisma.user.update({
      where: { id: user_id },
      data: { hash_refresh_token: hashRefreshToken },
    });
  }

  private async getTokens(user: User): Promise<Tokens> {
    delete user.password;
    delete user.hash_refresh_token;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.sign(user, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: '1h',
      }),
      this.jwt.sign(user, {
        secret: this.config.get('JWT_SECRET_REFRESH'),
        expiresIn: '3h',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
