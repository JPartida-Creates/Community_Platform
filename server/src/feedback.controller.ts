import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from './session-auth.guard';
import { StoreService } from './store.service';

@Controller('api/feedback')
@UseGuards(SessionAuthGuard)
export class FeedbackController {
  constructor(private readonly store: StoreService) {}

  @Get('me')
  mine(@Req() req: any) {
    return this.store.listFeedback(req.user.userId);
  }

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.store.createFeedback(req.user.userId, {
      title: String(body.title ?? '').trim(),
      details: String(body.details ?? '').trim(),
      area: String(body.area ?? 'GENERAL').trim(),
      type: String(body.type ?? 'OTHER').trim(),
    });
  }
}
