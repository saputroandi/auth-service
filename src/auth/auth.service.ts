import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signUp(dto: AuthDto): Promise<User> {
    // generate password hash
    const hashPassword = await argon.hash(dto.password);

    try {
      // save new user in the db
      const user = await this.prisma.user.create({
        data: { email: dto.email, password: hashPassword },
      });

      delete user.password;

      // return saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Email already taken');
      }

      throw error;
    }
  }
}
