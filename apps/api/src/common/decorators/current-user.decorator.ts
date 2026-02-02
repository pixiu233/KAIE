// ============================================
// 当前用户装饰器 - common/decorators/current-user.decorator.ts
// ============================================
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../modules/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);

