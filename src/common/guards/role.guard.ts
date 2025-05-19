import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if the user is authenticated
    if (!user) {
      throw new UnauthorizedException('No token provided');
    }

    // Check if the user has the "Super Admin" role
    const isSuperAdmin = user.role_id?.some((role: { title: string; }) => role.title === 'Super Admin');

    if (!isSuperAdmin) {
      throw new ForbiddenException('Access denied. Only Super Admins can perform this action.');
    }

    return true;
  }
}
