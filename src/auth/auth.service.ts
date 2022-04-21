import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(dto: AuthDto): Promise<{ access_token: string }> {
    // generate password hash
    const hashPassword = await argon.hash(dto.password);

    try {
      // save new user in the db
      const user = await this.prisma.user.create({
        data: { email: dto.email, password: hashPassword },
      });

      delete user.password;

      // return saved user
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Credential already taken');
      }

      throw error;
    }
  }

  async signIn(dto: AuthDto): Promise<{ access_token: string }> {
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

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
