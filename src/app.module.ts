import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PostModule,
    UserModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
