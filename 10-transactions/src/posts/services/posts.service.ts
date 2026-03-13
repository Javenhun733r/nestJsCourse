import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { TagsService } from "src/tags/providers/tags.service";
import { Tag } from "src/tags/tag.entity";
import { UsersService } from "src/users/providers/user.service";
import { Repository } from "typeorm";
import { CreatePostDto } from "../dtos/create-post.dto";
import { PatchPostDto } from "../dtos/patch-post.dto";
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
    /**
     * Inject tagsService
     */
    private readonly tagsService: TagsService,
  ) {}
  /**
   * Creating new posts
   */
  public async create(@Body() createPostDto: CreatePostDto) {
    const author = await this.usersService.findOneById(createPostDto.authorId);
    const tags = await this.tagsService.findMultipleTags(createPostDto.tags!);
    if (author) {
      const post = this.postsRepository.create({
        ...createPostDto,
        author: author,
        tags: tags,
      });
      return await this.postsRepository.save(post);
    }
  }

  public async findAll(userId: string) {
    console.log(userId);
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        // tags: true,
        // author: true,
      },
    });
    return posts;
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags: Tag[];
    let post: Post | null;
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags!);
    } catch {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
      );
    }
    if (!tags || tags.length !== patchPostDto.tags?.length) {
      throw new BadRequestException(
        "Please check your tag Ids and ensure they are correct",
      );
    }
    try {
      post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
    } catch {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
      );
    }
    if (!post) {
      throw new BadRequestException("The post Id does not exist");
    }

    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;
    post.tags = tags;
    try {
      await this.postsRepository.save(post);
    } catch {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
      );
    }
    return post;
  }
  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
