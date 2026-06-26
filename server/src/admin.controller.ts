import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from './session-auth.guard';
import { StoreService } from './store.service';

@Controller('api/admin')
@UseGuards(SessionAuthGuard)
export class AdminController {
  constructor(private readonly store: StoreService) {}

  @Get('summary')
  summary() {
    return this.store.adminSummary();
  }

  @Get('users')
  users() {
    return this.store.listUsers();
  }
}
