import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/providers/auth.service";
import { GetUsersParamDto } from "../dtos/get-users.dto";

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    console.log(getUsersParamDto, limit, page);
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    return [
      {
        firstName: "John",
        email: "john@doe.com",
      },
      {
        firstName: "Alice",
        email: "alice@doe.com",
      },
      {
        firstName: "Sam",
        email: "sam@doe.com",
      },
    ];
  }
  public findOneById(id: string) {
    console.log(id);
    return {
      id: 1234,
      firstName: "Alice",
      email: "alice@doe.com",
    };
  }
}
