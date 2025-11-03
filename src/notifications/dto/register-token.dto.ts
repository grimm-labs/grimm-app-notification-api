import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum Platform {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
}

export class RegisterTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsEnum(Platform)
  platform: Platform;
}
