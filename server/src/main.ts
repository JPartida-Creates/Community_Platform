import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
  }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'starter-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );

  app.enableCors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  const publicPath = join(__dirname, '..', 'client-dist');
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use('/assets', express.static(join(publicPath, 'assets'), {
    maxAge: '1y',
    immutable: true,
    fallthrough: false,
  }));
  expressApp.use(express.static(publicPath, { index: false, redirect: false }));
  expressApp.get(/^((?!\/api).)*$/, (_req: any, res: any) => {
    res.sendFile(join(publicPath, 'index.html'));
  });

  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
}

bootstrap();
