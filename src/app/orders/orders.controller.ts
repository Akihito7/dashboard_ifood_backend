import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { isISO8601 } from 'src/utils/isISO8601';
import { EnsureAuthenticationGuard } from 'src/guards/ensure-authentication.guard';
import { ChangeOrderStatusDto } from './dtos/change-order-status-dto';

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
    const { date } = req.query;
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
  async getOrdersByDay(@Req() req) {
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

  @Patch('status/:orderId')
  async changeOrderStatus(@Req() req, @Body() body: ChangeOrderStatusDto) {
    const { orderId } = req.params;
    const { nextIdOrderStatus } = body;
    if (!orderId) throw new BadRequestException('Please provide any orderId');
    return this.ordersService.changeOrderStatus({ orderId, nextIdOrderStatus });
  }

  @Get('details/:orderId')
  async getDetailsOrderById(@Req() req) {
    const { orderId } = req.params;
    if (!orderId) throw new BadRequestException('Please provider any order id');
    return this.ordersService.getDetailsOrderById(Number(orderId));
  }
}
