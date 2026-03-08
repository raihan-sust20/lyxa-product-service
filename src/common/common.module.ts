import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoggerService } from './logger/logger.service';
import { AuthRpcService } from './guards/jwt-auth/auth-rpc.service';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { UserDataExtractService } from './guards/jwt-auth/user-data-extract.service';
import { MessageModule } from '../message/message.module';

/**
 * Global module — imported once in AppModule, available everywhere.
 *
 * RabbitMQModule is registered in AppModule via RabbitMQModule.forRootAsync(),
 * which makes AmqpConnection available for injection globally — no need to
 * re-import RabbitMQModule here.
 *
 * JwtModule is registered without a secret — JwtDecodeService only calls
 * jwtService.decode() which does not verify the signature. Verification
 * is handled by auth-service over RabbitMQ RPC.
 *
 * Provides:
 *  - LoggerService      structured logging
 *  - AuthRpcService     sends validate_token RPC to auth-service via AmqpConnection
 *  - JwtAuthGuard       gRPC guard that delegates to AuthRpcService
 *  - JwtDecodeService   decodes JWT payload without signature verification
 */
@Global()
@Module({
  imports: [MessageModule, JwtModule.register({})],
  providers: [LoggerService, AuthRpcService, JwtAuthGuard, UserDataExtractService],
  exports: [LoggerService, AuthRpcService, JwtAuthGuard, UserDataExtractService],
})
export class CommonModule {}