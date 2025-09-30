import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../../common/enums/user-role.enum';
import { AuthUser } from '../interfaces/auth-user.interface';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: AuthUser; params: { id: string } }>();
    const user = request.user;
    const resourceId = parseInt(request.params.id, 10);

    if (!user) {
      throw new ForbiddenException('Требуется аутентификация');
    }

    // Админ имеет доступ ко всем ресурсам
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Обычный пользователь имеет доступ только к своим ресурсам
    if (user.userId === resourceId) {
      return true;
    }

    throw new ForbiddenException('Доступ запрещен');
  }
}
