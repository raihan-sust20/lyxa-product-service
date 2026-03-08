import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status, Metadata } from '@grpc/grpc-js';
import { AuthRpcService } from './auth-rpc.service';
import { AuthenticatedUser } from './authenticated-user.interface';
import { LoggerService } from '../../logger/logger.service';

/**
 * Guard that validates a JWT access token by forwarding it to auth-service
 * over RabbitMQ RPC via AuthRpcService.
 *
 * Flow:
 *   1. Extract Bearer token from gRPC metadata `authorization` key.
 *   2. Delegate to AuthRpcService.validateToken() → auth-service RabbitMQ RPC.
 *   3. If valid → attach AuthenticatedUser to RPC data as `_user`.
 *   4. If invalid / timeout / unreachable → throw UNAUTHENTICATED RpcException.
 *
 * Usage:
 *   @UseGuards(JwtAuthGuard)
 *   async getProduct(@CurrentUser() user: AuthenticatedUser) { ... }
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authRpcService: AuthRpcService,
    private readonly logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.extractGrpcMetadata(context);
    const token = this.extractBearerToken(metadata);

    if (!token) {
      this.logger.warn(
        '[JwtAuthGuard] Missing or malformed Authorization header',
        JwtAuthGuard.name,
      );
      this.throwUnauthenticated('Missing access token');
    }

    const response = await this.authRpcService.validateToken(token!);

    if (!response.valid || !response.userId || !response.email) {
      this.logger.warn(
        `[JwtAuthGuard] Token rejected — valid=${response.valid}`,
        JwtAuthGuard.name,
      );
      this.throwUnauthenticated('Invalid or expired access token');
    }

    // Attach validated user to the RPC data object so @CurrentUser() can read it.
    const rpcData = context.switchToRpc().getData();
    rpcData._user = {
      userId: response.userId,
      email: response.email,
    } satisfies AuthenticatedUser;

    return true;
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private extractGrpcMetadata(context: ExecutionContext): Metadata {
    const [, metadata] = context.switchToRpc().getContext<[unknown, Metadata]>();
    return metadata ?? new Metadata();
  }

  private extractBearerToken(metadata: Metadata): string | null {
    const values = metadata.get('authorization');
    if (!values.length) return null;

    const header = String(values[0]);
    const match = header.match(/^Bearer\s+(\S+)$/i);
    return match ? match[1] : null;
  }

  private throwUnauthenticated(message: string): never {
    throw new RpcException({
      code: status.UNAUTHENTICATED,
      message,
    });
  }
}