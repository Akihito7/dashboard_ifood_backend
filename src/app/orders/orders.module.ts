import { Module } from '@nestjs/common';
import { EmployeesController } from '../employees/employees.controller';
import { EmployeesService } from '../employees/employees.service';

@Module({
  imports: [],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class OrdersModule {}
