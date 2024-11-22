import { BadRequestException, Controller, Get, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { isISO8601 } from 'src/utils/isISO8601';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('total-by-day')
  async getTotalCountOrdersByDay(@Req() req) {
    const { date } = req.query;
    console.log(date);
    if (!date || !isISO8601(date))
      throw new BadRequestException(
        'Please provide a day in the request query in ISO format (YYYY-MM-DD). Example: 2024-11-19',
      );
    return this.ordersService.fetchTotalCountOrdersByDay(date);
  }

  @Get('total-by-month')
  async getTotalCountOrdersByMonth(@Req() req) {
    const { date } = req.query;
    if (!date || !isISO8601(date))
      throw new BadRequestException(
        'Please provide a day in the request query in ISO format (YYYY-MM-DD). Example: 2024-11-19',
      );
    return this.ordersService.fetchTotalCountOrdersByMonth(date);
  }

  @Get('metrics-revenue-by-month')
  async getTotalRevenueByMonth() {
    return this.ordersService.fetchMetricsRevenueByMonth();
  }

  @Get('total-revenue-by-period')
  async getTotalRevenueByPeriod(@Req() req) {
    const { startDate, endDate } = req.query;
    if (!isISO8601(startDate) || !isISO8601(endDate))
      throw new BadRequestException(
        'Please provide a day in the request query in ISO format (YYYY-MM-DD). Example: 2024-11-19',
      );
    return this.ordersService.fetchRevenueByPeriod(req.query);
  }

  @Get('by-month')
  async getTotalOdersByMonth(@Req() req) {
    const { date } = req.query;
    if (!date || !isISO8601(date))
      throw new BadRequestException(
        'Please provide a day in the request query in ISO format (YYYY-MM-DD). Example: 2024-11-19',
      );
    return this.ordersService.fetchTotalOrdersByMonth(date);
  }

  @Get('total-cancelled-by-month')
  async getOrdersCancelledByMonth(@Req() req) {
    const { date } = req.query;
    if (!date || !isISO8601(date))
      throw new BadRequestException(
        'Please provide a day in the request query in ISO format (YYYY-MM-DD). Example: 2024-11-19',
      );
    return this.ordersService.fetchTotalOrdersCancelledByMonth(date);
  }
}
