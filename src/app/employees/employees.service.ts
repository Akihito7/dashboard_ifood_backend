import { ForbiddenException, Injectable } from '@nestjs/common';
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

    const emailExists = await this.prisma.employees.count({
      where: { email },
    });

    if (emailExists) throw new ForbiddenException('Email already in uso!');

    const nameExists = await this.prisma.employees.count({
      where: { name },
    });

    if (nameExists)
      throw new ForbiddenException('Name already in uso!');

    const usernameExists = await this.prisma.employees.count({
      where: { username },
    });

    if (usernameExists)
      throw new ForbiddenException('Username already in uso!');

    await this.prisma.employees.create({
      data: {
        name,
        email,
        username,
        password: await hash(password, 8),
        roles,
      },
    });
  }

  async getDetailsEmployee(employeeId: number) {
    return this.prisma.employees.findUnique({
      where: { id: employeeId },
    });
  }
}
