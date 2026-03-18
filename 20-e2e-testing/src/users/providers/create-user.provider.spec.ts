import { Test, TestingModule } from "@nestjs/testing";

import { BadRequestException } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { HashingProvider } from "src/auth/providers/hashing.provider";
import { MailService } from "src/mail/providers/mail.service";
import { DataSource, ObjectLiteral, Repository } from "typeorm";
import { User } from "../user.entity";
import { CreateUserProvider } from "./create-user.provider";
type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});
describe("CreateUserProvider", () => {
  let provider: CreateUserProvider;
  let usersRepository: MockRepository;
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    password: "password",
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserProvider,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        {
          provide: HashingProvider,
          useValue: {
            hashPassword: jest.fn(() => user.password),
          },
        },
        {
          provide: MailService,
          useValue: { sendUserWelcome: jest.fn(() => Promise.resolve()) },
        },
      ],
    }).compile();

    provider = module.get<CreateUserProvider>(CreateUserProvider);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it("Should Be Defined", () => {
    expect(provider).toBeDefined();
  });
  describe("createUser", () => {
    describe("When User Does Not Exist", () => {
      it("Should create a new user", async () => {
        usersRepository.findOne?.mockResolvedValue(null);
        usersRepository.create?.mockReturnValue(user);
        usersRepository.save?.mockResolvedValue(user);

        await provider.createUser(user);

        expect(usersRepository.findOne).toHaveBeenCalledWith({
          where: { email: user.email },
        });
        expect(usersRepository.create).toHaveBeenCalledWith(user);
        expect(usersRepository.save).toHaveBeenCalledWith(user);
      });
    });
    describe("When Same User Exist", () => {
      it("Should Throw BadRequestException", async () => {
        usersRepository.findOne?.mockResolvedValue(user.email);
        usersRepository.create?.mockReturnValue(user);
        usersRepository.save?.mockResolvedValue(user);
        try {
          await provider.createUser(user);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
