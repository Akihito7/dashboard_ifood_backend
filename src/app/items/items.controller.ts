import { Controller, Get, UseGuards } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { EnsureAuthenticationGuard } from "src/guards/ensure-authentication.guard";

@Controller("api/items")
@UseGuards(EnsureAuthenticationGuard)
export class ItemsController {

  constructor(private readonly itemsService : ItemsService) {}

  @Get("best-sellers")
  async getItemsBestSeller(){
    return this.itemsService.fetchItemsBestSeller()
  }
}