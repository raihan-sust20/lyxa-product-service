import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../guards/jwt-auth/authenticated-user.interface';

/**
 * Parameter decorator that extracts the validated user attached by JwtAuthGuard.
 *
 * Usage:
 *   @UseGuards(JwtAuthGuard)
 *   async getProduct(@CurrentUser() user: AuthenticatedUser) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    // gRPC handlers receive arguments as positional parameters, not an HTTP
    // request object. NestJS stores custom context metadata on the handler's
    // argument list via getArgByIndex(). We attach the user to the RPC data
    // object so it is accessible here.
    const rpcData = ctx.switchToRpc().getData();
    return rpcData._user as AuthenticatedUser;
  },
);
