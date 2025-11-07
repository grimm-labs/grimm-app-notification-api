import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './create-notification.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsObject, IsString } from 'class-validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiPropertyOptional({
    description: 'The title of the notification',
    example: 'Updated Notification Title',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'The body/content of the notification',
    example: 'Updated notification content.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({
    description: 'Additional data payload for the notification',
    example: { featureId: '456', screen: 'Settings' },
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Time to live in seconds',
    example: 7200,
  })
  @IsOptional()
  @IsNumber()
  ttl?: number;

  @ApiPropertyOptional({
    description: 'Subtitle for iOS notifications',
    example: 'Updated Subtitle',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  iosMessageSubtitle?: string;

  @ApiPropertyOptional({
    description: 'Badge count for iOS notifications',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  badgeCount?: number;

  @ApiPropertyOptional({
    description: 'Android channel ID for notification grouping',
    example: 'updated_channel',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  androidChannelId?: string;
}
