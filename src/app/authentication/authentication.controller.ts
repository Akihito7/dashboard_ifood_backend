import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from './dtos/login-dto';
import { AuthenticationService } from './authentication.service';
@Controller("api/auth")
export class AuthenticationController {

  constructor(private readonly authenticationService : AuthenticationService) {}
  @Post("login")
  async login(@Body() body : LoginDTO){
    return this.authenticationService.login(body);
  }
}
