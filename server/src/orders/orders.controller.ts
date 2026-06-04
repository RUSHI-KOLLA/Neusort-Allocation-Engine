import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { OrdersService, Order, GarmentStatus } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders(): Order[] {
    return this.ordersService.findAll();
  }

  @Get('summary')
  getSummary(): Record<GarmentStatus, number> {
    return this.ordersService.getGarmentStatusSummary();
  }

  @Get(':id')
  getOrder(@Param('id') id: string): Order {
    const order = this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }
}
