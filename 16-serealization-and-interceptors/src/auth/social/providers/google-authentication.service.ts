import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { type ConfigType } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";
import jwtConfig from "src/auth/config/jwt.config";
import { GenerateTokensProvider } from "src/auth/providers/generate-tokens.provider";
import { UsersService } from "src/users/providers/user.service";
import { GoogleTokenDto } from "../dtos/google-token.dto";

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;
  constructor(
    /**
     * Inject usersService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /**
     * Inject generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }
  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      const payload = loginTicket.getPayload();

      if (!payload) {
        throw new UnauthorizedException(
          "Google authentication failed: No payload",
        );
      }

      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = payload;

      if (!email || !googleId) {
        throw new UnauthorizedException(
          "Google account must have an email and ID",
        );
      }

      const user = await this.usersService.findOneByGoogleId(googleId);

      if (user) {
        return this.generateTokensProvider.generateTokens(user);
      }

      const newUser = await this.usersService.createGoogleUser({
        email: email,
        firstName: firstName ?? "",

        lastName: lastName ?? "",
        googleId: googleId,
      });

      return this.generateTokensProvider.generateTokens(newUser);
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : "Google authentication failed",
      );
    }
  }
}
