import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PasswordService } from './password.service';
import { StoreService } from './store.service';
import { SessionAuthGuard } from './session-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly passwords: PasswordService,
    private readonly store: StoreService,
  ) {}

  @Post('register')
  register(@Body() body: any, @Res() res: Response) {
    const validation = this.passwords.validatePasswordStrength(String(body.password ?? ''));
    if (!validation.valid) {
      return res.status(400).json({ message: 'Password does not meet requirements.', errors: validation.errors });
    }

    if (this.store.findUserByEmail(String(body.email ?? ''))) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const user = this.store.createUser({
      email: String(body.email ?? '').trim().toLowerCase(),
      fullName: String(body.fullName ?? '').trim(),
      track: String(body.track ?? 'General Track').trim() || 'General Track',
      bio: '',
      interests: [],
      passwordHash: this.passwords.hashPassword(String(body.password)),
    });

    return res.status(201).json({
      message: 'Registration successful.',
      user: this.store.toSessionUser(user.id),
    });
  }

  @Post('login')
  login(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    const user = this.store.findUserByEmail(email);

    if (!user || !this.passwords.comparePassword(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    (req.session as any).user = this.store.toSessionUser(user.id);
    return res.json({ authenticated: true, user: (req.session as any).user });
  }

  @Get('session')
  session(@Req() req: Request) {
    if (!(req.session as any)?.user) {
      return { authenticated: false, user: null };
    }

    return { authenticated: true, user: (req.session as any).user };
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => undefined);
    res.clearCookie('connect.sid');
    return res.json({ ok: true });
  }

  @Post('change-password')
  @UseGuards(SessionAuthGuard)
  changePassword(@Req() req: any, @Body() body: any, @Res() res: Response) {
    const currentPassword = String(body.currentPassword ?? '');
    const newPassword = String(body.newPassword ?? '');
    const user = this.store.findUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (!this.passwords.comparePassword(currentPassword, user.passwordHash)) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const validation = this.passwords.validatePasswordStrength(newPassword);
    if (!validation.valid) {
      return res.status(400).json({ message: 'Password does not meet requirements.', errors: validation.errors });
    }

    this.store.updateUser(user.id, { passwordHash: this.passwords.hashPassword(newPassword) });
    return res.json({ ok: true });
  }
}
