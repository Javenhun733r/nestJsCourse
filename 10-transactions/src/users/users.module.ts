import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import profileConfig from "./config/profile.config";
import { UsersService } from "./providers/user.service";
import { UsersCreateManyProvider } from "./providers/users-create-many.provider";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersCreateManyProvider],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
  ],
})
export class UsersModule {}
