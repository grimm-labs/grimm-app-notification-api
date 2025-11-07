import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Grimm App Notification API')
    .setDescription('API for managing push notifications in Grimm App')
    .setVersion('1.0')
    .addTag('notifications', 'Operations related to notifications')
    .addTag('devices', 'Operations related to device registration')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Grimm App Notification API',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .information-container { background: #f5f5f5; padding: 20px; }
    `,
  });

  await app.listen(5000, '0.0.0.0');
  console.log('Notification API is running on: http://localhost:5000/api');
  console.log('API Documentation available at: http://localhost:5000/api/docs');
}

bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
  process.exit(1);
});
