import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PushService } from './push.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { RegisterTokenDto } from './dto/register-token.dto';
import { Notification, Device, NotificationStatus } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pushService: PushService,
  ) {}

  async registerToken(registerTokenDto: RegisterTokenDto): Promise<Device> {
    const { token, platform } = registerTokenDto;

    // Check if token already exists
    const existingDevice = await this.prisma.device.findUnique({
      where: { token },
    });

    if (existingDevice) {
      return existingDevice; // Do nothing if token exists
    }

    return await this.prisma.device.create({
      data: {
        token,
        platform,
      },
    });
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return await this.prisma.notification.create({
      data: {
        ...createNotificationDto,
        status: NotificationStatus.DRAFT,
      },
    });
  }

  async findAll(): Promise<Notification[]> {
    return await this.prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    await this.findOne(id); // Check if notification exists

    return await this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if notification exists

    await this.prisma.notification.delete({
      where: { id },
    });
  }

  async publish(id: string): Promise<Notification> {
    const notification = await this.findOne(id);

    if (notification.status === NotificationStatus.PUBLISHED) {
      throw new ConflictException('Notification is already published');
    }

    // Update status to PUBLISHED
    const publishedNotification = await this.prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.PUBLISHED,
      },
    });

    // Trigger push notification
    await this.pushService.sendNotification(publishedNotification);

    return publishedNotification;
  }
}
