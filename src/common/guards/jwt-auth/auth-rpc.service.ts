import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { LoggerService } from '../../logger/logger.service';
import {
  ValidateTokenRpcRequestDto,
  ValidateTokenRpcResponseDto,
} from './validate-token-rpc.dto';

const RPC_EXCHANGE = 'auth.rpc';
const RPC_ROUTING_KEY = 'auth.validate_token';
const RPC_TIMEOUT_MS = 5_000;

/**
 * Thin service that wraps AmqpConnection to send a validate_token RPC
 * request to auth-service and return its response.
 *
 * Kept separate from JwtAuthGuard so the transport detail (golevelup
 * AmqpConnection) is isolated behind a single injectable boundary.
 */
@Injectable()
export class AuthRpcService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly logger: LoggerService,
  ) {}

  async validateToken(
    accessToken: string,
  ): Promise<ValidateTokenRpcResponseDto> {
    const request: ValidateTokenRpcRequestDto = { accessToken };

    try {
      const response =
        await this.amqpConnection.request<ValidateTokenRpcResponseDto>({
          exchange: RPC_EXCHANGE,
          routingKey: RPC_ROUTING_KEY,
          payload: request,
          timeout: RPC_TIMEOUT_MS,
        });

      return response;
    } catch (error) {
      this.logger.error(
        `[AuthRpcService] validate_token RPC failed: ${(error as Error).message}`,
        (error as Error).stack,
        AuthRpcService.name,
      );

      // Treat any transport failure as an invalid token — the guard will
      // surface this as UNAUTHENTICATED to the caller.
      return { valid: false };
    }
  }
}
