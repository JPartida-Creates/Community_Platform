import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from './session-auth.guard';
import { StoreService } from './store.service';

@Controller('api')
@UseGuards(SessionAuthGuard)
export class DeliverablesController {
  constructor(private readonly store: StoreService) {}

  @Get('my/deliverables')
  list(@Req() req: any) {
    return this.store.listDeliverables(req.user.userId);
  }

  @Post('my/deliverables/:id/submit')
  submit(@Req() req: any, @Param('id') deliverableId: string, @Body() body: any) {
    return this.store.submitDeliverable(req.user.userId, deliverableId, {
      link: String(body.link ?? '').trim(),
      notes: String(body.notes ?? '').trim(),
    });
  }
}
