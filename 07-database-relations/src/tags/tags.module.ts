import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "./tag.entity";
import { TagsController } from "./tags.controller";

@Module({
  controllers: [TagsController],
  imports: [TypeOrmModule.forFeature([Tag])],
})
export class TagsModule {}
