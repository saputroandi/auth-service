import { IGenericRepository } from './generic-repository.abstract';
import { User } from '../../user/entity';
import { Post } from '../../post/entity';

export abstract class IDataServices {
  abstract user: IGenericRepository<User>;

  abstract post: IGenericRepository<Post>;
}
