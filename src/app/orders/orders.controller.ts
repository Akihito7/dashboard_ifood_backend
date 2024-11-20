import { BadRequestException, Controller, Get, Req } from "@nestjs/common";
import { OrdersService } from "./orders.service";

@Controller("api/orders")
export class OrdersController {

  constructor(private readonly ordersService : OrdersService ){}

  @Get("total-by-day")
  async getCountOrdersByDay(@Req() req){
    const { day } = req.query;
    if(!day) throw new BadRequestException("Please provide a day in the request query! Example day: 19/11/2024");
    return this.ordersService.fetchCountOrdersByDay(day);
  }

  @Get("total-by-month")
  async getCountOrdersByMonth(@Req() req){
    const { date } = req.query;
    if(!date) throw new BadRequestException("Please provide a day in the request query! Example day: 19/11/2024");
    return this.ordersService.fetchCountOrdersByMonth(date);
  }
}