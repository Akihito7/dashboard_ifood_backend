import { Controller, Get } from "@nestjs/common";
import { ItemsService } from "./items.service";

@Controller("api/items")
export class ItemsController {

  constructor(private readonly itemsService : ItemsService) {}

  @Get("best-seller")
  async getItemsBestSeller(){
    return this.itemsService.fetchItemsBestSeller()
  }
}