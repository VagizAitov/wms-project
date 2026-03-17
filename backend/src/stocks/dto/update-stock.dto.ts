import { IsInt, IsUUID, Min } from 'class-validator';

export class UpdateStockDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  warehouseId: string;

  @IsInt()
  @Min(0)
  quantity: number;
}