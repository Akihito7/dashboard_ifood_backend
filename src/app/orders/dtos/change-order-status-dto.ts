import { IsNumber, IsString } from "class-validator";

export class ChangeOrderStatusDto {
  @IsNumber()
  nextIdOrderStatus : number
}