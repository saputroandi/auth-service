import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, EditPostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(user_id: number, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        user_id: user_id,
        ...dto,
      },
    });

    return post;
  }

  async getPosts(user_id: number) {
    const posts = await this.prisma.post.findMany({
      where: {
        user_id,
      },
    });

    return posts;
  }

  async getPostById(user_id: number, post_id: number) {
    const post = await this.prisma.post.findFirst({
      where: { id: post_id, user_id },
    });

    if (!post) throw new NotFoundException('Not Valid');

    console.log(post);

    return post;
  }

  async editPostById(user_id: number, post_id: number, dto: EditPostDto) {
    const post = await this.prisma.post.findUnique({ where: { id: post_id } });

    if (!post || post.user_id != user_id)
      throw new ForbiddenException('Unauthorize');

    const updatedPost = await this.prisma.post.update({
      where: { id: post_id },
      data: { ...dto },
    });

    return updatedPost;
  }

  async deletePostById(user_id: number, post_id: number) {
    const post = await this.prisma.post.findUnique({ where: { id: post_id } });

    if (!post || post.user_id != user_id)
      throw new ForbiddenException('Unauthorize');

    await this.prisma.post.delete({ where: { id: post_id } });
  }
}
