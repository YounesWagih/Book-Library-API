import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { AuthenticatedUser } from '../types'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!roles) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user as AuthenticatedUser
    return roles.includes(user.role)
  }
}
