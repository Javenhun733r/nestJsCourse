import { Test, TestingModule } from "@nestjs/testing";

import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { User } from "../user.entity";
import { CreateGoogleUserProvider } from "./create-google-user.provider";
import { CreateUserProvider } from "./create-user.provider";
import { FindOneByGoogleIdProvider } from "./find-one-by-google-id.provider";
import { FindOneUserByEmailProvider } from "./find-one-user-by-email.provider";
import { UsersService } from "./user.service";
import { UsersCreateManyProvider } from "./users-create-many.provider";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const mockCreateUserProvider: Partial<CreateUserProvider> = {
      createUser: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: 12,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName!,
          email: createUserDto.email,
          password: createUserDto.password,
        }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: CreateUserProvider, useValue: mockCreateUserProvider },
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: UsersCreateManyProvider, useValue: {} },
        { provide: FindOneUserByEmailProvider, useValue: {} },
        { provide: FindOneByGoogleIdProvider, useValue: {} },
        { provide: CreateGoogleUserProvider, useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("Should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("createUser", () => {
    it("Should be defined", () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.createUser).toBeDefined();
    });
    it("Should call createUser on CreateUserProvider", async () => {
      const user = await service.createUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        password: "password",
      });
      expect(user.firstName).toEqual("John");
    });
  });
});
