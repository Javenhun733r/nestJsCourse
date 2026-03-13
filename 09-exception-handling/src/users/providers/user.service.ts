import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from "@nestjs/common";
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

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser;
    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: "Error connecting to the database",
        },
      );
    }
    if (existingUser) {
      throw new BadRequestException(
        "The user already exists, please check your email.",
      );
    }

    let newUser = this.usersRepository.create(createUserDto);
    try {
      newUser = await this.usersRepository.save(newUser);
    } catch {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: "Error connecting to the database",
        },
      );
    }

    return newUser;
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
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: "The API endpoint does not exist",
        fileName: "users.service.ts",
        lineNumber: 88,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: "Occured because the API endpoint was permanently moved",
      },
    );
  }
  /**
   * Find a single user using the ID of the user
   */
  public async findOneById(id: number): Promise<User> {
    let user: User | null;
    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: "Error connecting to the database",
        },
      );
    }
    if (!user) {
      throw new BadRequestException("The user id does not exist");
    }
    return user;
  }
}
