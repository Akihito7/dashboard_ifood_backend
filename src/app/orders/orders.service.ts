import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchCountOrdersByDay(day: string) {
    const startDateFormatted = new Date(day + ' 00:00:00')
    const endDateFormatted = new Date(day + ' 23:59:59')
 
    return this.prisma.orders.count({
      where : {
        order_date: {
          gte: startDateFormatted,
          lte: endDateFormatted, 
        },
      }
    })
  }

  async fetchCountOrdersByMonth(date: string) {
    const inputDate = new Date(date);
    const startDateFormatted = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1, 0, 0, 0, 0);
    const endDateFormatted = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0, 0, 59, 59, 999);
    return this.prisma.orders.count({
      where: {
        order_date: {
          gte: startDateFormatted,
          lte: endDateFormatted,
        },
      },
    });
  }
}
