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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { RegisterTokenDto } from './dto/register-token.dto';
import {
  NotificationEntity,
  DeviceEntity,
} from './entities/notification.entity';
import { Notification, Device } from '@prisma/client';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('register-token')
  @ApiOperation({
    summary: 'Register a device token',
    description:
      'Register a device token for push notifications. If the token already exists, it will be ignored.',
  })
  @ApiCreatedResponse({
    description: 'Device token registered successfully',
    type: DeviceEntity,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'token must be a string',
          'platform must be one of: ANDROID, IOS',
        ],
        error: 'Bad Request',
      },
    },
  })
  async registerToken(
    @Body() registerTokenDto: RegisterTokenDto,
  ): Promise<Device> {
    return await this.notificationsService.registerToken(registerTokenDto);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new notification',
    description:
      'Create a new notification in DRAFT status. It will not be sent until published.',
  })
  @ApiBody({ type: CreateNotificationDto })
  @ApiCreatedResponse({
    description: 'Notification created successfully',
    type: NotificationEntity,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['title should not be empty', 'body should not be empty'],
        error: 'Bad Request',
      },
    },
  })
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return await this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all notifications',
    description:
      'Retrieve a list of all notifications, ordered by creation date (newest first)',
  })
  @ApiOkResponse({
    description: 'List of notifications retrieved successfully',
    type: [NotificationEntity],
  })
  async findAll(): Promise<Notification[]> {
    return await this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific notification',
    description: 'Retrieve a specific notification by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Notification retrieved successfully',
    type: NotificationEntity,
  })
  @ApiNotFoundResponse({
    description: 'Notification not found',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Notification with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
      },
    },
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
    return await this.notificationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a notification',
    description:
      'Update an existing notification. Only DRAFT notifications can be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiOkResponse({
    description: 'Notification updated successfully',
    type: NotificationEntity,
  })
  @ApiNotFoundResponse({
    description: 'Notification not found',
    schema: {
      example: {
        statusCode: 404,
        message:
          'Notification with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or UUID format',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return await this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a notification',
    description: 'Delete a notification permanently',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description: 'Notification deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Notification not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.notificationsService.remove(id);
  }

  @Put(':id/publish')
  @ApiOperation({
    summary: 'Publish a notification',
    description:
      'Publish a DRAFT notification. This will change its status to PUBLISHED and send push notifications to all registered devices.',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Notification published successfully',
    type: NotificationEntity,
  })
  @ApiNotFoundResponse({
    description: 'Notification not found',
  })
  @ApiConflictResponse({
    description: 'Notification is already published',
    schema: {
      example: {
        statusCode: 409,
        message: 'Notification is already published',
        error: 'Conflict',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format',
  })
  async publish(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
    return await this.notificationsService.publish(id);
  }
}
