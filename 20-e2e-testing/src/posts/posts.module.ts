import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaginationModule } from "src/common/pagination/pagination.module";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { TagsModule } from "src/tags/tags.module";
import { UsersModule } from "src/users/users.module";
import { Post } from "./post.entity";
import { PostsController } from "./posts.controller";
import { PostsService } from "./services/posts.service";
import { CreatePostProvider } from './providers/create-post.provider';

@Module({
  imports: [
    UsersModule,
    TagsModule,
    PaginationModule,
    TypeOrmModule.forFeature([Post, MetaOption]),
  ],
  controllers: [PostsController],
  providers: [PostsService, CreatePostProvider],
})
export class PostsModule {}
