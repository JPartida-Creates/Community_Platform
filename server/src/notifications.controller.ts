import { Controller, Get, Patch, Post, Param, Req, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from './session-auth.guard';
import { StoreService } from './store.service';

@Controller('api/notifications')
@UseGuards(SessionAuthGuard)
export class NotificationsController {
  constructor(private readonly store: StoreService) {}

  @Get()
  list(@Req() req: any) {
    return this.store.listNotifications(req.user.userId);
  }

  @Get('unread-count')
  unreadCount(@Req() req: any) {
    return { unreadCount: this.store.unreadNotificationCount(req.user.userId) };
  }

  @Patch(':id/read')
  markRead(@Req() req: any, @Param('id') notificationId: string) {
    return this.store.markNotificationRead(req.user.userId, notificationId);
  }

  @Post('mark-all-read')
  markAll(@Req() req: any) {
    return this.store.markAllNotificationsRead(req.user.userId);
  }
}
