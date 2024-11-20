import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
@Controller("api/auth")
export class AuthenticationController {

  constructor(private readonly jwt : JwtService) {}

  @Post("login")
  async login(@Body() body : any){
    return "Hello"
  }
}
