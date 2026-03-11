import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Param,
  Post,
  Query,
} from "@nestjs/common";
// @Param('id', ParseIntPipe) id: number | undefined,
// @Param('optional') optional?: number | undefined,
// @Query('limit', ParseIntPipe) limit?: number,
@Controller("users")
export class UsersController {
  @Get("/:id{/:optional}")
  public getUsers(
    @Param("id") id: any,
    @Param("optional") optional?: any,
    @Query("limit") limit?: number,
  ) {
    console.log(id, limit, optional);
    return "You sent a get request to users endpoint";
  }
  @Post()
  public createUser(
    @Body() request: any,
    @Headers() headers: any,
    @Ip() ip: any,
  ) {
    console.log(request);
    console.log(headers);
    console.log(ip);
    return "You sent a post request to users endpoint";
  }
}
