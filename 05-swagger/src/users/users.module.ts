import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { UsersService } from "./providers/user.service";
import { UsersController } from "./users.controller";
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [forwardRef(() => AuthModule)],
})
export class UsersModule {}
