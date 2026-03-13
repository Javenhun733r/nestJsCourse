import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateManyUsersDto } from "../dtos/create-many-users.dto";
import { User } from "../user.entity";

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    /**
     * Inject Datasource
     */
    private readonly dataSource: DataSource,
  ) {}
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch {
      throw new RequestTimeoutException("Could not connect to the database");
    }

    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException("Could not complete the transaction", {
        description: String(error),
      });
    } finally {
      try {
        await queryRunner.release();
      } catch (error) {
        console.error("Could not release the connection", error);
      }
    }
    return newUsers;
  }
}
