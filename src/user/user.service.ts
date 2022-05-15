import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(id: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: { id: id },
      data: { ...dto },
    });

    delete user.password;
    delete user.hash_refresh_token;

    return user;
  }
}
