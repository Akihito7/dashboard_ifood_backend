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

    const response = await this.prisma.$queryRawUnsafe(
      `
      WITH 
total_orders_current_month AS (
    SELECT CAST(COUNT(*) AS INT) AS total_current
    FROM orders o
    WHERE o.order_date >= $1
    AND o.order_date <=  $2
),
total_orders_previous_month AS (
    SELECT CAST(COUNT(*) AS INT) AS total_previous
    FROM orders o
    WHERE o.order_date >= $3
    AND o.order_date <= $4
)

SELECT 
    COALESCE(total_current, 0) AS total_orders_current,
    CASE 
        WHEN total_previous = 0 THEN 1
        ELSE total_previous
    END AS total_orders_previous,
     CAST(
        ((total_current - 
            CASE 
                WHEN total_previous = 0 THEN 1
                ELSE total_previous
            END
        ) * 100.0) /
        CASE 
            WHEN total_previous = 0 THEN 1
            ELSE total_previous
        END AS DECIMAL(10, 2)
    ) AS percentage_change
FROM 
    total_orders_current_month,
    total_orders_previous_month;
`,
      startDateCurrentDay,
      endDateCurrentDay,
      startDatePreviousDay,
      endDatePreviousDay,
    );

    return response[0];
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

    const response = await this.prisma.$queryRawUnsafe(
      `
      WITH 
total_orders_current_month AS (
    SELECT CAST(COUNT(*) AS INT) AS total_current
    FROM orders o
    WHERE o.order_date >= $1
    AND o.order_date <=  $2
),
total_orders_previous_month AS (
    SELECT CAST(COUNT(*) AS INT) AS total_previous
    FROM orders o
    WHERE o.order_date >= $3
    AND o.order_date <= $4
)

SELECT 
    COALESCE(total_current, 0) AS total_orders_current,
    COALESCE(total_previous, 0) AS total_orders_previous,
  CAST(
        ((total_current - 
            CASE 
                WHEN total_previous = 0 THEN 1
                ELSE total_previous
            END
        ) * 100.0) /
        CASE 
            WHEN total_previous = 0 THEN 1
            ELSE total_previous
        END AS DECIMAL(10, 2)
    ) AS percentage_change
FROM 
    total_orders_current_month,
    total_orders_previous_month;
`,
      startDateCurrentMonth,
      endDateCurrentMonth,
      startDatePreviousMonth,
      endDatePreviousMonth,
    );

    return response[0]
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
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const currentDayOrders = await this.prisma.$queryRawUnsafe(
      `
      SELECT 
          o.id, 
          o.order_date, 
          o.total_price, 
          o.status_id, 
          o.created_at, 
          o.updated_at, 
          o.username,
          os.name_ptbr AS status,
          CASE 
              WHEN EXTRACT(DAY FROM NOW() - o.order_date) > 0 THEN 
                  EXTRACT(DAY FROM NOW() - o.order_date)::TEXT || ' dias atrás'
              WHEN EXTRACT(HOUR FROM NOW() - o.order_date) > 0 THEN 
                  EXTRACT(HOUR FROM NOW() - o.order_date)::TEXT || ' horas atrás'
              WHEN EXTRACT(MINUTE FROM NOW() - o.order_date) > 0 THEN 
                  EXTRACT(MINUTE FROM NOW() - o.order_date)::TEXT || ' minutos atrás'
              ELSE 
                  EXTRACT(SECOND FROM NOW() - o.order_date)::TEXT || ' segundos atrás'
          END AS time_elapsed
      FROM orders o
      INNER JOIN order_status os ON os.id = o.status_id
      WHERE o.order_date >= $1
        AND o.order_date <= $2
      ORDER BY o.order_date DESC
  `,
      startDate,
      endDate,
    );

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

    const response = await this.prisma.$queryRawUnsafe(
      `
  WITH 
total_orders_previous_month AS (
    SELECT 
        CAST(COUNT(*) AS INT) AS total_previous
    FROM orders o
    WHERE o.order_date >= '2024-06-21'
      AND o.order_date <= '2024-06-25'
      AND o.status_id = 5
),

total_orders_current_month AS (
    SELECT 
        CAST(COUNT(*) AS INT) AS total_current
    FROM orders o
    WHERE o.order_date >= '2024-07-21'
      AND o.order_date <= '2024-07-25'
      AND o.status_id = 5
)

SELECT 
    COALESCE(total_current, 0) AS total_orders_cancelled,
    CAST(
        ((total_current - 
            CASE 
                WHEN total_previous = 0 THEN 1
                ELSE total_previous
            END
        ) * 100.0) /
        CASE 
            WHEN total_previous = 0 THEN 1
            ELSE total_previous
        END AS DECIMAL(10, 2)
    ) AS percentage_change
FROM 
    total_orders_previous_month, 
    total_orders_current_month;
      `,
      startDateCurrentMonth,
      endDateCurrentMonth,
      startDatePreviousMonth,
      endDatePreviousMonth,
    );

    return response[0];
  }

  async changeOrderStatus({ orderId, nextIdOrderStatus }: any) {
    await this.prisma.orders.update({
      data: {
        status_id: nextIdOrderStatus,
      },
      where: {
        id: Number(orderId),
      },
    });
  }

  async getDetailsOrderById(orderId: number) {
    return await this.prisma.$queryRawUnsafe(
      `
      SELECT 
o.id,
o.total_price,
o.username,
o.status_id,
o.order_date,
os.name_ptbr as status,
 json_agg(
        json_build_object(
            'id_item', io.id_item,
            'quantity', io.quantity,
            'name', i.name,
            'price', i.price,
            'description', i.description
        )
    ) AS items
FROM orders o
INNER JOIN items_order io ON io.id_order = o.id
INNER JOIN items i ON i.id = io.id_item
INNER JOIN order_status os ON os.id = o.status_id
WHERE o.id = $1
GROUP BY o.id, os.name_ptbr`,
      orderId,
    );
  }
}
