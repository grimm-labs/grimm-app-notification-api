import { Injectable, Logger } from '@nestjs/common';
import { Notification, Device } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface ExpoPushMessage {
  to: string | string[];
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  ttl?: number;
  priority?: 'default' | 'normal' | 'high';
  subtitle?: string;
  sound?: 'default' | null;
  badge?: number;
  channelId?: string;
}

interface ExpoPushTicket {
  status: 'ok' | 'error';
  id?: string;
  message?: string;
  details?: {
    error?:
      | 'DeviceNotRegistered'
      | 'InvalidCredentials'
      | 'MessageTooBig'
      | 'MessageRateExceeded';
  };
}

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private readonly expoApiUrl = 'https://exp.host/--/api/v2/push/send';

  constructor(private readonly prisma: PrismaService) {}

  async sendNotification(notification: Notification): Promise<void> {
    try {
      const devices = await this.prisma.device.findMany();

      if (devices.length === 0) {
        this.logger.warn('No devices registered for push notifications');
        return;
      }

      const messages: ExpoPushMessage[] = [];

      for (const device of devices) {
        if (!this.isExpoPushToken(device.token)) {
          this.logger.warn(
            `Push token ${device.token} is not a valid Expo push token`,
          );
          continue;
        }

        const message: ExpoPushMessage = {
          to: device.token,
          sound: 'default',
          title: notification.title || undefined,
          body: notification.body || undefined,
          data: this.safeParseData(notification.data),
        };

        if (device.platform === 'IOS') {
          if (notification.iosMessageSubtitle) {
            message.subtitle = notification.iosMessageSubtitle;
          }
          if (
            notification.badgeCount !== null &&
            notification.badgeCount !== undefined
          ) {
            message.badge = notification.badgeCount;
          }
        }

        if (device.platform === 'ANDROID') {
          if (notification.androidChannelId) {
            message.channelId = notification.androidChannelId;
          }
          message.priority = 'high';
        }

        if (notification.ttl) {
          message.ttl = notification.ttl;
        }

        messages.push(message);
      }

      if (messages.length === 0) {
        this.logger.warn('No valid push tokens found');
        return;
      }

      this.logger.log(`Sending ${messages.length} push notifications`);

      const chunks = this.chunkArray(messages, 100);

      for (const [index, chunk] of chunks.entries()) {
        try {
          this.logger.log(
            `Sending chunk ${index + 1}/${chunks.length} with ${chunk.length} messages`,
          );

          const response = await fetch(this.expoApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'Accept-Encoding': 'gzip, deflate',
            },
            body: JSON.stringify(chunk),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = (await response.json()) as { data: ExpoPushTicket[] };

          const startIndex = index * 100;
          const endIndex = startIndex + chunk.length;
          const chunkDevices = devices.slice(startIndex, endIndex);
          await this.processPushTickets(data.data, chunkDevices);

          this.logger.log(`Chunk ${index + 1} sent successfully`);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          this.logger.error(`Error sending chunk ${index + 1}:`, errorMessage);
        }
      }

      this.logger.log('All push notifications processed');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Error in sendNotification:', errorMessage);
      throw new Error(`Failed to send push notifications: ${errorMessage}`);
    }
  }

  private async processPushTickets(
    tickets: ExpoPushTicket[],
    devices: Device[],
  ): Promise<void> {
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      const device = devices[i];

      if (!ticket || !device) continue;

      if (ticket.status === 'error') {
        this.logger.error(
          `Push notification failed for token ${device.token}: ${ticket.message}`,
        );

        if (ticket.details?.error === 'DeviceNotRegistered') {
          this.logger.log(`Removing invalid token: ${device.token}`);
          try {
            await this.prisma.device.delete({
              where: { token: device.token },
            });
          } catch (deleteError: unknown) {
            const deleteErrorMessage =
              deleteError instanceof Error
                ? deleteError.message
                : 'Unknown error';
            this.logger.error(
              `Failed to remove device token ${device.token}:`,
              deleteErrorMessage,
            );
          }
        }
      }

      if (ticket.status === 'ok') {
        this.logger.log(
          `Push notification sent successfully to ${device.token}`,
        );
      }
    }
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private isExpoPushToken(token: string): boolean {
    return (
      typeof token === 'string' &&
      (token.startsWith('ExponentPushToken[') ||
        token.startsWith('ExpoPushToken['))
    );
  }

  private safeParseData(data: unknown): Record<string, unknown> {
    if (!data) return {};

    try {
      if (typeof data === 'string') {
        return JSON.parse(data) as Record<string, unknown>;
      }
      if (typeof data === 'object' && data !== null) {
        return data as Record<string, unknown>;
      }
      return {};
    } catch {
      return {};
    }
  }
}
