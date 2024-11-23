import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getMonthBoundary } from 'src/utils/get-month-boundary';
import { FetchRevenueByPeriodDto } from './dtos/fetch-revenue-by-period-dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchTotalCountOrdersByDay(date: string) {
    const startDateCurrentDay = new Date(date);
    startDateCurrentDay.setUTCHours(0, 0, 0, 0);

    const endDateCurrentDay = new Date(date);
    endDateCurrentDay.setUTCHours(23, 59, 59, 999);

    const startDatePreviousDay = new Date(date);
    startDatePreviousDay.setDate(startDatePreviousDay.getDate() - 1);
    startDatePreviousDay.setUTCHours(0, 0, 0, 0);

    const endDatePreviousDay = new Date(date);
    endDatePreviousDay.setDate(endDatePreviousDay.getDate() - 1);
    endDatePreviousDay.setUTCHours(23, 59, 59, 999);

    const totalOrdersCurrentDay = await this.prisma.orders.count({
      where: {
        order_date: {
          gte: startDateCurrentDay,
          lte: endDateCurrentDay,
        },
      },
    });

    const totalOrdersPreviousDay = await this.prisma.orders.count({
      where: {
        order_date: {
          gte: startDatePreviousDay,
          lte: endDatePreviousDay,
        },
      },
    });

    const percentageChange = (
      ((Number(totalOrdersCurrentDay) - Number(totalOrdersPreviousDay)) /
        Number(totalOrdersPreviousDay)) *
      100
    ).toFixed(2);
    return {
      totalOrders: totalOrdersCurrentDay,
      percentageChange,
    };
  }

  async fetchTotalCountOrdersByMonth(date: string) {
    const startDateCurrentMonth = getMonthBoundary({
      type: 'first',
      date: date,
    });
    const endDateCurrentMonth = getMonthBoundary({ type: 'last', date: date });

    const datePreviousMonth = new Date(date);
    datePreviousMonth.setMonth(datePreviousMonth.getMonth() - 1);

    const startDatePreviousMonth = getMonthBoundary({
      type: 'first',
      date: datePreviousMonth,
    });
    const endDatePreviousMonth = getMonthBoundary({
      type: 'last',
      date: datePreviousMonth,
    });

    const currentOrders = await this.prisma.orders.count({
      where: {
        order_date: {
          gte: startDateCurrentMonth,
          lte: endDateCurrentMonth,
        },
      },
    });

    const previousOrders = await this.prisma.orders.count({
      where: {
        order_date: {
          gte: startDatePreviousMonth,
          lte: endDatePreviousMonth,
        },
      },
    });

    const percentageChange = (
      ((Number(currentOrders) - Number(previousOrders)) /
        Number(previousOrders)) *
      100
    ).toFixed(2);

    return {
      totalOrders: currentOrders,
      percentageChange,
    };
  }

  async fetchMetricsRevenueByMonth(date: string) {
    const startDateCurrentMonth = getMonthBoundary({
      type: 'first',
      date: new Date(date),
    });
    const endDateCurrentMonth = getMonthBoundary({
      type: 'last',
      date: new Date(date),
    });

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

    const startDatePreviousMonth = getMonthBoundary({
      type: 'first',
      date: previousMonth,
    });

    const endDatePreviousMonth = getMonthBoundary({
      type: 'last',
      date: startDatePreviousMonth,
    });

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

    const previousMonthTotalRevenue =
      previousMonthRevenue._sum.total_price || 0;

    let percentageChange = 0;
    if (Number(previousMonthTotalRevenue) > 0) {
      percentageChange = Number(
        (
          ((Number(currentMonthTotalRevenue) -
            Number(previousMonthTotalRevenue)) /
            Number(previousMonthTotalRevenue)) *
          100
        ).toFixed(2),
      );
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

  async fetchOrdersByMonth(date: string) {
    const startDate = getMonthBoundary({
      type: 'first',
      date,
    });

    const endDate = getMonthBoundary({
      type: 'last',
      date,
    });

    const currentMonthOrders = await this.prisma.orders.findMany({
      where: {
        order_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        order_date: 'desc',
      },
    });
    
    return {
      orders: currentMonthOrders,
    };
  }

  async fetchOrdersByDay(date: string) {

    const startDate = new Date(date);
    startDate.setUTCHours(0,0,0,0)
    const endDate = new Date(date)
    endDate.setUTCHours(23, 59, 59, 999)
  
    const currentDayOrders = await this.prisma.orders.findMany({
      where: {
        order_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        order_date: 'desc',
      },
    });

    return {
      orders: currentDayOrders,
    };
  }

  async fetchTotalOrdersCancelledByMonth(date: string) {
    const startDateCurrentMonth = getMonthBoundary({
      type: 'first',
      date,
    });
    const endDateCurrentMonth = getMonthBoundary({
      type: 'last',
      date,
    });

    const datePreviousMonth = new Date(date);
    datePreviousMonth.setMonth(datePreviousMonth.getMonth() - 1);

    const startDatePreviousMonth = getMonthBoundary({
      type: 'first',
      date: datePreviousMonth,
    });

    const endDatePreviousMonth = getMonthBoundary({
      type: 'last',
      date: datePreviousMonth,
    });

    const ordersCancelledCurrentMonth = await this.prisma.orders.count({
      where: {
        is_cancelled: true,
        order_date: {
          gte: startDateCurrentMonth,
          lte: endDateCurrentMonth,
        },
      },
    });

    const ordersCancelledPreviousMonth = await this.prisma.orders.count({
      where: {
        is_cancelled: true,
        order_date: {
          gte: startDatePreviousMonth,
          lte: endDatePreviousMonth,
        },
      },
    });

    const percentageChange =
      ((Number(ordersCancelledCurrentMonth) -
        Number(ordersCancelledPreviousMonth)) /
        Number(ordersCancelledPreviousMonth ?? 1)) *
      100;

    return {
      totalOrdersCancelled: ordersCancelledCurrentMonth,
      percentageChange: percentageChange === Infinity ? 100 : percentageChange,
    };
  }
}
