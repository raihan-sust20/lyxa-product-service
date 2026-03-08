import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        exchanges: [
          // Domain events — async fire-and-forget
          {
            name: 'auth.events',
            type: 'topic',
          },
          // RPC — synchronous request/reply from other microservices
          {
            name: 'auth.rpc',
            type: 'direct',
          },
        ],
        uri: config.get<string>('rabbitmq.url')!,
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class MessageModule {}
