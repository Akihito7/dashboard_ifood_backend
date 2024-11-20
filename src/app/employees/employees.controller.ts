import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { RegisterEmployeeDto } from "./dtos/register-employees-dto";
import { EnsureAuthenticationGuard } from "src/guards/ensure-authentication.guard";

@Controller("api/employees")
@UseGuards(EnsureAuthenticationGuard)
export class EmployeesController {

  constructor(private readonly employeesService : EmployeesService) {}
  
  @Post("register")
  @HttpCode(201)
  async registerEmployee(@Body() body : RegisterEmployeeDto){
    return this.employeesService.registerEmployee(body);
  }
}