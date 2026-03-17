import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "src/users/providers/user.service";
import { SignInDto } from "../dtos/signin.dto";
import { GenerateTokensProvider } from "./generate-tokens.provider";
import { HashingProvider } from "./hashing.provider";

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * Inject userService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /**
     * Inject HashingProvider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * Inject generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  public async singIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: "Could not compare passwords",
      });
    }
    if (!isEqual) {
      throw new UnauthorizedException("Incorrect Password");
    }
    return await this.generateTokensProvider.generateTokens(user);
  }
}
