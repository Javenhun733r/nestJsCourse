import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { Post, PostSchema } from './post.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UsersModule,
  ],
})
export class PostsModule {}
