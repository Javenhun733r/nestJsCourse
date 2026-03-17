import { Body, Controller, Post } from "@nestjs/common";
import { Auth } from "../decorators/auth.decorator";
import { AuthType } from "../enums/auth-type.enum";
import { GoogleTokenDto } from "./dtos/google-token.dto";
import { GoogleAuthenticationService } from "./providers/google-authentication.service";
@Auth(AuthType.None)
@Controller("auth/google-authentication")
export class GoogleAuthenticationController {
  constructor(
    /**
     * Inject googleAuthenticationService
     */
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}
  @Post()
  public authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthenticationService.authenticate(googleTokenDto);
  }
}
