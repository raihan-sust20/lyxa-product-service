import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { AuthRpcService } from './guards/jwt-auth/auth-rpc.service';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

/**
 * Global module — imported once in AppModule, available everywhere.
 *
 * RabbitMQModule is registered in AppModule via RabbitMQModule.forRootAsync(),
 * which makes AmqpConnection available for injection globally — no need to
 * re-import RabbitMQModule here.
 *
 * Provides:
 *  - LoggerService    structured logging
 *  - AuthRpcService   sends validate_token RPC to auth-service via AmqpConnection
 *  - JwtAuthGuard     gRPC guard that delegates to AuthRpcService
 */
@Global()
@Module({
  providers: [LoggerService, AuthRpcService, JwtAuthGuard],
  exports: [LoggerService, AuthRpcService, JwtAuthGuard],
})
export class CommonModule {}
