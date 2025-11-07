// push.service.ts (alternative)
import { Injectable, Logger } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { PrismaNullable } from '../types/utils';

type LogNotification = PrismaNullable<
  Pick<
    Notification,
    | 'id'
    | 'title'
    | 'body'
    | 'data'
    | 'ttl'
    | 'iosMessageSubtitle'
    | 'badgeCount'
    | 'androidChannelId'
    | 'status'
  >
>;

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  async sendNotification(notification: Notification): Promise<void> {
    // Conversion automatique des types
    const logData: LogNotification = {
      id: notification.id,
      title: notification.title,
      body: notification.body,
      data: (notification.data as Record<string, any>) ?? undefined,
      ttl: notification.ttl ?? undefined,
      iosMessageSubtitle: notification.iosMessageSubtitle ?? undefined,
      badgeCount: notification.badgeCount ?? undefined,
      androidChannelId: notification.androidChannelId ?? undefined,
      status: notification.status,
    };

    this.logger.log(' Sending push notification with enhanced data:', logData);
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.logger.log(' Push notification sent successfully with all parameters');
  }
}
