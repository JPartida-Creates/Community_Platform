import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from './session-auth.guard';
import { StoreService } from './store.service';

@Controller('api/profile')
@UseGuards(SessionAuthGuard)
export class ProfileController {
  constructor(private readonly store: StoreService) {}

  @Get()
  profile(@Req() req: any) {
    return this.store.findUserById(req.user.userId);
  }

  @Put()
  update(@Req() req: any, @Body() body: any) {
    const user = this.store.updateUser(req.user.userId, {
      fullName: typeof body?.fullName === 'string' ? body.fullName.trim() : undefined,
      track: typeof body?.track === 'string' ? body.track.trim() : undefined,
      bio: typeof body?.bio === 'string' ? body.bio.trim() : undefined,
      interests: Array.isArray(body?.interests) ? body.interests.map((item: unknown) => String(item).trim()).filter(Boolean) : undefined,
    });
    return this.store.toSessionUser(user?.id ?? req.user.userId);
  }
}
