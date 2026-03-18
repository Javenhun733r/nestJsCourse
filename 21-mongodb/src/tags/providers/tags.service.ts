import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { Tag } from '../tags.schema';

@Injectable()
export class TagsService {
  constructor(
    /*
     * Inject tagModel
     */
    @InjectModel(Tag.name)
    private readonly tagModel: Model<Tag>,
  ) {}
  public async createTag(createTagDto: CreateTagDto) {
    const newTag = new this.tagModel(createTagDto);
    return await newTag.save();
  }
}
