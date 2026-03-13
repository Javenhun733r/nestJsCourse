import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./providers/user.service";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { ConfigModule } from "@nestjs/config";
import profileConfig from "./config/profile.config";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
  ],
})
export class UsersModule {}
