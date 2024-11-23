import { BadRequestException, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { isISO8601 } from 'src/utils/isISO8601';
import { EnsureAuthenticationGuard } from 'src/guards/ensure-authentication.guard';

@Controller('api/orders')
@UseGuards(EnsureAuthenticationGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('total-by-day')
  async getTotalCountOrdersByDay(@Req() req) {
    const { date } = req.query;
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
  async getTotalRevenueByMonth(@Req() req) {
    const {date} = req.query;
    if (!date || !isISO8601(date))
      throw new BadRequestException(
        'Please provide a day in the request query in ISO format (YYYY-MM-DD). Example: 2024-11-19',
      );
    return this.ordersService.fetchMetricsRevenueByMonth(date);
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
  async getOdersByMonth(@Req() req) {
    const { date } = req.query;
    if (!date || !isISO8601(date))
      throw new BadRequestException(
        'Please provide a day in the request query in ISO format (YYYY-MM-DD). Example: 2024-11-19',
      );
    return this.ordersService.fetchOrdersByMonth(date);
  }

  @Get('by-day')
  async getOrdersByDay(@Req() req){
    const { date } = req.query;
    if (!date || !isISO8601(date))
      throw new BadRequestException(
        'Please provide a day in the request query in ISO format (YYYY-MM-DD). Example: 2024-11-19',
      );
      return this.ordersService.fetchOrdersByDay(date);
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
