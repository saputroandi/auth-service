import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, EditPostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(user_id: string, dto: CreatePostDto) {
    try {
      const post = await this.prisma.post.create({
        data: {
          user_id: user_id,
          ...dto,
        },
      });

      return post;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Title already taken');
      }

      throw error;
    }
  }

  async getPosts(user_id: string) {
    const posts = await this.prisma.post.findMany({
      where: { user_id },
      include: { user: true },
    });

    return posts;
  }

  async getPostById(user_id: string, post_id: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: post_id, user_id },
      include: { user: true },
    });

    if (!post) throw new NotFoundException('Not Valid');

    return post;
  }

  async editPostById(user_id: string, post_id: string, dto: EditPostDto) {
    const post = await this.prisma.post.findFirst({
      where: { id: post_id, user_id },
    });

    if (!post) throw new NotFoundException('Not Valid');

    const updatedPost = await this.prisma.post.update({
      where: { id: post_id },
      data: { ...dto },
    });

    return updatedPost;
  }

  async deletePostById(user_id: string, post_id: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: post_id, user_id },
    });

    if (!post) throw new NotFoundException('Not Valid');

    await this.prisma.post.delete({ where: { id: post_id } });
  }
}
