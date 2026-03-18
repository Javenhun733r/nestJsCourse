import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsService } from './providers/tags.service';
import { TagsController } from './tags.controller';
import { Tag, TagSchema } from './tags.schema';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Tag.name,
        schema: TagSchema,
      },
    ]),
  ],
})
export class TagsModule {}
