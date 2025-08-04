import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5678',
      'http://localhost:6789',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5678',
      'http://127.0.0.1:6789',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 5678);
}
bootstrap();
