import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './create-notification.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiPropertyOptional({
    description: 'The title of the notification',
    example: 'Updated Notification Title',
    maxLength: 255,
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'The body/content of the notification',
    example: 'Updated notification content.',
    maxLength: 1000,
  })
  body?: string;
}
