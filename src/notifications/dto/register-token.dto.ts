import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Platform {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
}

export class RegisterTokenDto {
  @ApiProperty({
    description: 'The device token for push notifications (FCM or Expo)',
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'The platform of the device',
    enum: Platform,
    example: Platform.IOS,
  })
  @IsEnum(Platform)
  platform: Platform;
}
