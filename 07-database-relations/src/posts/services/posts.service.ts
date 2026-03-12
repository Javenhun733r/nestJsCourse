import { Body, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { UsersService } from "src/users/providers/user.service";
import { Repository } from "typeorm";
import { CreatePostDto } from "../dtos/create-post.dto";
import { Post } from "../post.entity";

@Injectable()
export class PostsService {
  constructor(
    /**
     * Inject usersService
     */
    private readonly usersService: UsersService,
    /**
     * Inject postRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    /**
     * Inject metaOptionsRepository
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}
  /**
   * Creating new posts
   */
  public async create(@Body() createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    console.log(user);
    const posts = await this.postsRepository.find();
    return posts;
  }
  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
