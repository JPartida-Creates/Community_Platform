import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from './session-auth.guard';
import { StoreService } from './store.service';

@Controller('api/analytics')
@UseGuards(SessionAuthGuard)
export class AnalyticsController {
  constructor(private readonly store: StoreService) {}

  @Get('overview')
  overview() {
    return this.store.adminSummary();
  }

  @Get('my-overview')
  myOverview(@Req() req: any) {
    return this.store.getDashboardOverview(req.user.userId);
  }

  @Get('ranking')
  ranking() {
    return this.store.getRanking();
  }

  @Get('points-guide')
  pointsGuide() {
    return this.store.getPointsGuide();
  }
}
