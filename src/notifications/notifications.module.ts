import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PushService } from './push.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PushService, PrismaService],
})
export class NotificationsModule {}
