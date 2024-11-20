import { Controller, Post } from "@nestjs/common";
import { EmployeesService } from "./employees.service";

@Controller("api/employees")
export class EmployeesController {

  constructor(private readonly employeesService : EmployeesService) {}
  
  @Post("register")
  async registerEmployee(){
    
  }

}