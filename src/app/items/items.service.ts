import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ItemsService {
  constructor(private readonly prisma : PrismaService) {}

  async fetchItemsBestSeller(){

    const topItemsWithoutName = await this.prisma.items_order.groupBy({
      by : ["id_item"],
       _count : {
        _all : true
       },
       orderBy: {
        _count: {
          id_item: 'desc',
        },
      },
      take: 5,
    });

    const topItemsWithName = await Promise.all(topItemsWithoutName.map(async (item) => {
      const itemDetails = await this.prisma.items.findUnique({
        where : { id : item.id_item }
      });

      return {
        idProduct : itemDetails.id,
        nameProduct : itemDetails.name,
        totalSeller : item._count._all,
        totalRevenue : (item._count._all * Number(itemDetails.price)).toFixed(2)
      }
    }));

    return topItemsWithName
  }
}