import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getMonthBoundary } from 'src/utils/get-month-boundary';
import { FetchRevenueByPeriodDto } from './dtos/fetch-revenue-by-period-dto';

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

    const startDateCurrentMonth = getMonthBoundary({ type : "first", date : new Date()})
    const endDateCurrentMonth = getMonthBoundary({ type : "last", date : new Date()})
  
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
    
    const previousMonth = new Date(startDateCurrentMonth);
    previousMonth.setMonth(startDateCurrentMonth.getMonth() - 1);

    const startDatePreviousMonth = getMonthBoundary({type : "first", date : previousMonth})
  
    const endDatePreviousMonth = getMonthBoundary({ type : "last", date : startDatePreviousMonth})
  
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

  async fetchRevenueByPeriod({ startDate, endDate }: FetchRevenueByPeriodDto) {
    return this.prisma.orders.groupBy({
      by: ['order_date'], 
      _sum: {
        total_price: true, 
      },
      _count: {
        _all: true, 
      },
      where: {
        order_date: {
          gte: startDate,
          lte: endDate, 
        },
      },
      orderBy: {
        order_date: 'asc', 
      },
    });
  }
}


