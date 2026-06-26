import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AuthController } from './auth.controller';
import { ProgramController } from './program.controller';
import { AnalyticsController } from './analytics.controller';
import { CommunityController } from './community.controller';
import { DeliverablesController } from './deliverables.controller';
import { FeedbackController } from './feedback.controller';
import { NotificationsController } from './notifications.controller';
import { ProfileController } from './profile.controller';
import { AdminController } from './admin.controller';
import { PasswordService } from './password.service';
import { StoreService } from './store.service';
import { SessionAuthGuard } from './session-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    ProgramController,
    AnalyticsController,
    CommunityController,
    DeliverablesController,
    FeedbackController,
    NotificationsController,
    ProfileController,
    AdminController,
  ],
  providers: [PasswordService, StoreService, SessionAuthGuard],
})
export class AppModule {}
