import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { PostsController } from "./posts.controller";
import { PostsService } from "./services/posts.service";

@Module({
  imports: [UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
