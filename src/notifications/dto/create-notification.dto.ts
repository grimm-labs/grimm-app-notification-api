import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
