import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/providers/auth.service";
import { GetUsersParamDto } from "../dtos/get-users.dto";
/*
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  /**
   * The method to get all the users from the database
   */
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
  /**
   * Find a single user using the ID of the user
   */
  public findOneById(id: string) {
    console.log(id);
    return {
      id: 1234,
      firstName: "Alice",
      email: "alice@doe.com",
    };
  }
}
