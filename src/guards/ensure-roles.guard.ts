import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/app/decorators/roles-decorator';
import { PrismaService } from 'src/app/prisma/prisma.service';


@Injectable()
export class EnsureRolesGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const { id } = request.user;

    const user = await this.prismaService.employees.findUnique({
      where: { id },
    });

    if (!user || !requiredRoles.includes(user.roles)) {
      throw new UnauthorizedException("Resource only permitted for specified roles!");
    }

    return true;
  }
}
