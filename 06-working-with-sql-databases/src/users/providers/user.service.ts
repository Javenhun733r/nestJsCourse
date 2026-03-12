import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { GetUsersParamDto } from "../dtos/get-users.dto";
import { User } from "../user.entity";
/*
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting usersRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async createUser(сreateUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: сreateUserDto.email },
    });
    if (!existingUser) {
      let newUser = this.usersRepository.create(сreateUserDto);
      newUser = await this.usersRepository.save(newUser);
      return newUser;
    }
  }
  /**
   * The method to get all the users from the database
   */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    console.log(getUsersParamDto, limit, page);
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
