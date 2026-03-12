import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { Post } from "./post.entity";
import { PostsController } from "./posts.controller";
import { PostsService } from "./services/posts.service";
import { MetaOption } from "src/meta-options/meta-option.entity";

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Post, MetaOption])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
