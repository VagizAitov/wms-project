import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @Length(2, 255)
  name: string;

  @IsOptional()
  @IsString()
  category?: string;
}