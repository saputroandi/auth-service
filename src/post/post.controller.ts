import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreatePostDto } from './dto';
import { PostService } from './post.service';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getPost() {}

  @Get()
  getPostById() {}

  @Post()
  createPost(@GetUser('id') id: number, @Body() payload: CreatePostDto) {
    return this.postService.createPost(id, payload);
  }

  @Patch()
  editPostById() {}

  @Delete()
  deletePostById() {}
}
