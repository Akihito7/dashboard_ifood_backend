import { BadRequestException, Controller, Get, Req } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { isISO8601 } from "src/utils/isISO8601";

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

  @Get("metrics-revenue-by-month")
  async getTotalRevenueByMonth(){
    return this.ordersService.fetchMetricsRevenueByMonth();
  }

  @Get('revenue-by-period')
  async getTotalRevenueByPeriod(@Req() req){
    const { startDate , endDate } = req.query;
    if(!isISO8601(startDate) || !isISO8601(endDate)) throw new BadRequestException("Please provide a date with format ISO8601");
    return this.ordersService.fetchRevenueByPeriod(req.query)
  }
  
}