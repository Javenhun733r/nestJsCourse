import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/providers/user.service";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { SignInDto } from "../dtos/signin.dto";
import { RefreshTokenProvider } from "./refresh-token.provider";
import { SignInProvider } from "./sign-in.provider";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /**
     * Inject signInProvider
     */
    private readonly signInProvider: SignInProvider,
    /**
     * Inject refreshTokenProvider
     */
    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.singIn(signInDto);
  }
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokenProvider.refreshTokens(refreshTokenDto);
  }
}
