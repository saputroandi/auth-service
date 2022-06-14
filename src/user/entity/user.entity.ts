import { Post } from 'src/post/entity';

export class User {
  email: string;

  password: string;

  hash_refresh_token: string;

  name: string;

  post: Post;
}
