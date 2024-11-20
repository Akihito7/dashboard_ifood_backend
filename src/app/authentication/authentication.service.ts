import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDTO } from './dtos/login-dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login({ email, password }: LoginDTO) {

    const employee = await this.prisma.employees.findUnique({
      where: {
        email,
      },
    });

    if (!employee)
      throw new UnauthorizedException('Email and/or password incorrect');

    const passwordMatched = await compare(password, employee.password);

    if (!passwordMatched)
      throw new UnauthorizedException('Email and/or password incorrect');

    const token = this.generateToken(employee.id.toString());

    return { token }
  }

  private generateToken(userId : string){
    return this.jwt.sign({}, {
      subject : userId,
      audience : "employees",
      issuer : "login"
    })
  }

  async checkToken(token : string){
    try {
      return this.jwt.verify(token);
    } catch (error) {
      throw new UnauthorizedException("Invalid token!")
    }
  }
}
