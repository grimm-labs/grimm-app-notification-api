import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'The title of the notification',
    example: 'New Feature Available!',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The body/content of the notification',
    example: 'We have released a new feature that you might find useful.',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({
    description: 'Additional data payload for the notification',
    example: { featureId: '123', screen: 'Home' },
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Time to live in seconds',
    example: 3600,
  })
  @IsOptional()
  @IsNumber()
  ttl?: number;

  @ApiPropertyOptional({
    description: 'Subtitle for iOS notifications',
    example: 'Important Update',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  iosMessageSubtitle?: string;

  @ApiPropertyOptional({
    description: 'Badge count for iOS notifications',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  badgeCount?: number;

  @ApiPropertyOptional({
    description: 'Android channel ID for notification grouping',
    example: 'default_channel',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  androidChannelId?: string;
}
