import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ActiveUserData } from "src/auth/interfaces/active-user-data.interface";
import { TagsService } from "src/tags/providers/tags.service";
import { Tag } from "src/tags/tag.entity";
import { UsersService } from "src/users/providers/user.service";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { CreatePostDto } from "../dtos/create-post.dto";
import { Post } from "../post.entity";

@Injectable()
export class CreatePostProvider {
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
     * Inject tagsService
     */
    private readonly tagsService: TagsService,
  ) {}
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author: User | undefined;
    let tags: Tag[] = [];

    try {
      author = await this.usersService.findOneById(user.sub);

      if (createPostDto.tags && createPostDto.tags.length > 0) {
        tags = await this.tagsService.findMultipleTags(createPostDto.tags);
      }
    } catch (error) {
      throw new BadRequestException("Could not fetch author or tags", {
        cause: error,
      });
    }

    if (createPostDto.tags && createPostDto.tags.length !== tags.length) {
      throw new BadRequestException("Some tag IDs are invalid");
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    try {
      return await this.postsRepository.save(post);
    } catch {
      throw new ConflictException("A post with this slug already exists", {
        description: "Ensure post slug is unique",
      });
    }
  }
}
