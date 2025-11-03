import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatus } from '@prisma/client';

export class NotificationEntity {
  @ApiProperty({
    description: 'Unique identifier for the notification',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Notification title',
    example: 'New Feature Available!',
  })
  title: string;

  @ApiProperty({
    description: 'Notification body/content',
    example: 'We have released a new feature that you might find useful.',
  })
  body: string;

  @ApiProperty({
    description: 'Notification status',
    enum: NotificationStatus,
    example: NotificationStatus.DRAFT,
  })
  status: NotificationStatus;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class DeviceEntity {
  @ApiProperty({
    description: 'Unique identifier for the device',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Device token for push notifications',
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
  })
  token: string;

  @ApiProperty({
    description: 'Device platform',
    enum: ['ANDROID', 'IOS'],
    example: 'IOS',
  })
  platform: string;

  @ApiProperty({
    description: 'Registration timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
