import { Body, Controller, Post, Req } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  create(@Body() dto: CreateOperationDto, @Req() req) {
    return this.operationsService.create(dto, req.user.id);
  }
}