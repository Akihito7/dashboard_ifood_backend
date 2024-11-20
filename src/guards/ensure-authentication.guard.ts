import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Injectable()
export class EnsureAuthenticationGuard implements CanActivate {
  constructor(private readonly authService : AuthenticationService) {}
  async canActivate(context: ExecutionContext) {

    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if(!authorization) throw new UnauthorizedException("Authorization token is missing or invalid.");

    const [, token] = authorization.split(" ");

    const { sub : userId} = await this.authService.checkToken(token);

    request.user = {
      id : Number(userId)
    }

    return true;
  }
}
