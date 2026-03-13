import { Inject, Injectable } from "@nestjs/common";
import { type ConfigType } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import profileConfig from "../config/profile.config";
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
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
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
    // const environment = this.configService.get<string>("S3_BUCKET");
    // console.log(environment);
    console.log(this.profileConfiguration);
    console.log(this.profileConfiguration.apiKey);
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
  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({
      id,
    });
  }
}
