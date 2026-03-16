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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Auth } from "src/auth/decorators/auth.decorator";
import { AuthType } from "src/auth/enums/auth-type.enum";
import { CreateManyUsersDto } from "./dtos/create-many-users.dto";
import { CreateUserDto } from "./dtos/create-user.dto";
import { GetUsersParamDto } from "./dtos/get-users.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { UsersService } from "./providers/user.service";

@Controller("users")
@ApiTags("Users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get("{/:id}")
  @ApiOperation({
    summary: "Fetches a list of registered users on the application",
  })
  @ApiResponse({
    status: 200,
    description: "Users fetched successfully based on the query ",
  })
  @ApiQuery({
    name: "limit",
    type: "number",
    required: false,
    description: "The number of entries returned pre query",
    example: 10,
  })
  @ApiQuery({
    name: "page",
    type: "number",
    required: false,
    description:
      "The position of the page number that you want the APi to return.",
    example: 1,
  })
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUsersParamDto, limit, page);
  }
  @Post()
  @Auth(AuthType.None)
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Post("create-many")
  public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.usersService.createMany(createManyUsersDto);
  }
  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
