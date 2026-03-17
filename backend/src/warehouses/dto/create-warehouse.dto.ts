import { IsOptional, IsString, Length } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  @Length(2, 255)
  name: string;

  @IsOptional()
  @IsString()
  location?: string;
}