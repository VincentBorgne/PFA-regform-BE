import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5175',
      'https://pfareg.ydev.thescorehub.com',
      'https://pfareg.xdev.thescorehub.com'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT;
  await app.listen(port, '0.0.0.0');  // Add '0.0.0.0' here
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();