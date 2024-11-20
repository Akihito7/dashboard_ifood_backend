import { Controller, Get, Post } from '@nestjs/common';

@Controller("api/auth")
export class AuthenticationController {

  @Post("login")
  async login(){
    return "Logado com sucesso"
  }
}
