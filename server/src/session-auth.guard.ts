import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.session?.user) {
      request.user = request.session.user;
      return true;
    }

    throw new UnauthorizedException('Session expired or invalid.');
  }
}
