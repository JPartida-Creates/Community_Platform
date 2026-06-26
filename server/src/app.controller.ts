import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { SessionAuthGuard } from './session-auth.guard';

@Controller('api')
export class AppController {
  constructor(private readonly store: StoreService) {}

  @Get('health/db')
  getHealth() {
    return this.store.health();
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  getMe(@Req() req: any) {
    return req.user;
  }
}
