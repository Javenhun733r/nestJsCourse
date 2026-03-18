import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { User } from '../user.schema';
/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
  public async createUser(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }
  /**
   * The method to get all the users from the database
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limt: number,
    page: number,
  ) {
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }
  /**
   * Find a single user using the ID of the user
   */
  public findOneById(id: string) {
    return {
      id: 1234,
      firstName: 'Alice',
      email: 'alice@doe.com',
    };
  }
}
