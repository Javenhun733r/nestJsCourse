import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ActiveUser } from "src/auth/decorators/active-user.decorator";
import type { ActiveUserData } from "src/auth/interfaces/active-user-data.interface";
import { CreatePostDto } from "./dtos/create-post.dto";
import { GetPostsDto } from "./dtos/get-posts.dto";
import { PatchPostDto } from "./dtos/patch-post.dto";
import { PostsService } from "./services/posts.service";

@Controller("posts")
@ApiTags("Posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get("{/:userId}")
  public getPosts(
    @Param("userId") userId: string,
    @Query() postQuery: GetPostsDto,
  ) {
    return this.postsService.findAll(postQuery, userId);
  }
  @ApiOperation({
    summary: "Creates a new blog post",
  })
  @ApiResponse({
    status: 201,
    description: "You get a 201 response if your post is created successfully",
  })
  @Post()
  public createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    console.log(user);
    return this.postsService.create(createPostDto, user);
  }
  @ApiOperation({
    summary: "Updates an existing blog post",
  })
  @ApiResponse({
    status: 200,
    description: "You get a 200 response if a post is updated successfully",
  })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postsService.update(patchPostDto);
  }
  @Delete()
  public deletePost(@Query("id", ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
