import { Controller, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Controller("api/auth")
export class AuthenticationController {

  @Post("login")
  async login(){
    return "Hello"
  }
}
