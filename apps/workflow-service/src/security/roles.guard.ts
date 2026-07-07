import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user || {};
    const roles = user.roles || user.role || [];
    const normalizedRoles = Array.isArray(roles) ? roles : [roles];

    if (requiredRoles.some((role) => normalizedRoles.includes(role))) return true;

    throw new ForbiddenException('Insufficient role permissions');
  }
}
