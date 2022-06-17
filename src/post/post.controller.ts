import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreatePostDto, EditPostDto } from './dto';
import { PostService } from './post.service';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  // @Get()
  // getPosts(@GetUser('id') user_id: number) {
  //   return this.postService.getPosts(user_id);
  // }

  // @Get(':id')
  // getPostById(
  //   @GetUser('id') user_id: number,
  //   @Param('id', ParseIntPipe) post_id: number,
  // ) {
  //   return this.postService.getPostById(user_id, post_id);
  // }

  // @HttpCode(HttpStatus.CREATED)
  // @Post()
  // createPost(@GetUser('id') id: number, @Body() payload: CreatePostDto) {
  //   return this.postService.createPost(id, payload);
  // }

  // @Patch(':id')
  // editPostById(
  //   @GetUser('id') user_id: number,
  //   @Param('id', ParseIntPipe) post_id: number,
  //   dto: EditPostDto,
  // ) {
  //   return this.postService.editPostById(user_id, post_id, dto);
  // }

  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Delete(':id')
  // deletePostById(
  //   @GetUser('id') user_id: number,
  //   @Param('id', ParseIntPipe) post_id: number,
  // ) {
  //   return this.postService.deletePostById(user_id, post_id);
  // }
}
