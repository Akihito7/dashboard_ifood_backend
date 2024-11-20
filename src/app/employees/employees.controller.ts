import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { RegisterEmployeeDto } from "./dtos/register-employees-dto";

@Controller("api/employees")
export class EmployeesController {

  constructor(private readonly employeesService : EmployeesService) {}
  
  @Post("register")
  @HttpCode(201)
  async registerEmployee(@Body() body : RegisterEmployeeDto){
    return this.employeesService.registerEmployee(body);
  }

}