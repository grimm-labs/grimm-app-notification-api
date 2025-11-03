import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { RegisterTokenDto } from './dto/register-token.dto';
import { Notification, Device } from '@prisma/client';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('register-token')
  async registerToken(
    @Body() registerTokenDto: RegisterTokenDto,
  ): Promise<Device> {
    return await this.notificationsService.registerToken(registerTokenDto);
  }

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return await this.notificationsService.create(createNotificationDto);
  }

  @Get()
  async findAll(): Promise<Notification[]> {
    return await this.notificationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
    return await this.notificationsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return await this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.notificationsService.remove(id);
  }

  @Put(':id/publish')
  async publish(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
    return await this.notificationsService.publish(id);
  }
}
