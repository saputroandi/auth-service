import { Body, Injectable } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  createPost(@GetUser('id') id: number, @Body() payload: CreatePostDto) {}
}
