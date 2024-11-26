import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { RegisterEmployeeDto } from './dtos/register-employees-dto';
import { EnsureAuthenticationGuard } from 'src/guards/ensure-authentication.guard';
import { Roles } from '../decorators/roles-decorator';
import { EnsureRolesGuard } from 'src/guards/ensure-roles.guard';

@Controller('api/employees')
@UseGuards(EnsureAuthenticationGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}
   

  @Post('register')
  @UseGuards(EnsureAuthenticationGuard, EnsureRolesGuard)
  @Roles("admin")
  @HttpCode(201)
  async registerEmployee(@Body() body: RegisterEmployeeDto) {
    return this.employeesService.registerEmployee(body);
  }

  @Get('details')
  async getDetailsEmployee(@Req() req) {
    return this.employeesService.getDetailsEmployee(req.user.id);
  }
}
