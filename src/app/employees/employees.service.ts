import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterEmployeeDto } from './dtos/register-employees-dto';
import { hash } from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async registerEmployee({
    name,
    email,
    username,
    password,
    roles,
  }: RegisterEmployeeDto) {

     
    await this.prisma.employees.create({
      data: {
        name,
        email,
        username,
        password : await hash(password, 8),
        roles,
      },
    });
  }
}
