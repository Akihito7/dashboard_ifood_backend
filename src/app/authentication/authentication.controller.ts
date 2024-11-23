import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from './dtos/login-dto';
import { AuthenticationService } from './authentication.service';
import { VerifyTokenDto } from './dtos/verify-token-dto';
@Controller('api/auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authenticationService.login(body);
  }

  @Post('verify-token')
  async verifyToken(@Body() body: VerifyTokenDto) {
    const { token } = body;
    if (!token)
      throw new BadRequestException('Please provider a token to verify!');
    await this.authenticationService.checkToken(token);
    return {
      isValidToken: true,
    };
  }
}
