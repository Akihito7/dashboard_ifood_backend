import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchCountOrdersByDay(day: string) {
    const startDateFormatted = new Date(day + ' 00:00:00');
    const endDateFormatted = new Date(day + ' 23:59:59');

    return this.prisma.orders.count({
      where: {
        order_date: {
          gte: startDateFormatted,
          lte: endDateFormatted,
        },
      },
    });
  }

  async fetchCountOrdersByMonth(date: string) {
    const inputDate = new Date(date);
    const startDateFormatted = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    const endDateFormatted = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth() + 1,
      0,
      0,
      59,
      59,
      999,
    );
    return this.prisma.orders.count({
      where: {
        order_date: {
          gte: startDateFormatted,
          lte: endDateFormatted,
        },
      },
    });
  }

  async fetchMetricsRevenueByMonth() {
    const startDateCurrentMonth = new Date();
    startDateCurrentMonth.setDate(1);
    startDateCurrentMonth.setHours(0, 0, 0, 0);
  
    const endDateCurrentMonth = new Date(startDateCurrentMonth);
    endDateCurrentMonth.setMonth(startDateCurrentMonth.getMonth() + 1);
    endDateCurrentMonth.setDate(0);
    endDateCurrentMonth.setHours(0, 59, 59, 999);
 
    const currentMonthRevenue = await this.prisma.orders.aggregate({
      _sum: {
        total_price: true,
      },
      where: {
        order_date: {
          gte: startDateCurrentMonth,
          lte: endDateCurrentMonth,
        },
      },
    });
  
    const currentMonthTotalRevenue = currentMonthRevenue._sum.total_price || 0;

    const startDatePreviousMonth = new Date(startDateCurrentMonth);
    startDatePreviousMonth.setMonth(startDateCurrentMonth.getMonth() - 1);
    startDatePreviousMonth.setDate(1);
    startDatePreviousMonth.setHours(0, 0, 0, 0);

  
    const endDatePreviousMonth = new Date(startDatePreviousMonth);
    endDatePreviousMonth.setMonth(startDatePreviousMonth.getMonth() + 1);
    endDatePreviousMonth.setDate(0);
    endDatePreviousMonth.setHours(0, 59, 59, 999);

  
    const previousMonthRevenue = await this.prisma.orders.aggregate({
      _sum: {
        total_price: true,
      },
      where: {
        order_date: {
          gte: startDatePreviousMonth,
          lte: endDatePreviousMonth,
        },
      },
    });
  
    const previousMonthTotalRevenue = previousMonthRevenue._sum.total_price || 0;

    let percentageChange = 0;
    if (Number(previousMonthTotalRevenue) > 0) {
      percentageChange = Number((((Number(currentMonthTotalRevenue) - Number(previousMonthTotalRevenue)) / Number(previousMonthTotalRevenue)) * 100).toFixed(2));
    }
  
    return {
      currentMonthTotalRevenue,
      /* previousMonthTotalRevenue, */
      percentageChange,
    };
  }

}
