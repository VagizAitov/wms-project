import {
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { OperationType } from '@prisma/client';

export class CreateOperationDto {
  @IsEnum(OperationType)
  type: OperationType;

  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsUUID()
  fromWarehouseId?: string;

  @IsOptional()
  @IsUUID()
  toWarehouseId?: string;
}