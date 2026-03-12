import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { GetUsersParamDto } from "./dtos/get-users.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { UsersService } from "./providers/user.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get("{/:id}")
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUsersParamDto, limit, page);
  }
  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto instanceof CreateUserDto);
    return "You sent a post request to users endpoint";
  }
  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
