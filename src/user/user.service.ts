import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(id: string, dto: EditUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) throw new NotFoundException('Not Valid');

    const userUpdated = await this.prisma.user.update({
      where: { id: id },
      data: { ...dto },
    });

    delete userUpdated.password;
    delete userUpdated.hash_refresh_token;

    return userUpdated;
  }
}
