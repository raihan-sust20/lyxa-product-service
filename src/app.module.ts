import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import configuration from './config/configuration';
import type { Connection, ConnectOptions } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log(
          `Connecting to MongoDB at ${config.get<string>('mongodb.uri')}`,
        );
        return {
          uri: config.get<string>('mongodb.uri')!,
          onConnectionCreate: (connection: Connection) => {
            connection.on('connected', () => console.log('MongoDB connected'));
            connection.on('open', () =>
              console.log('MongoDB connection opened'),
            );
            connection.on('disconnected', () =>
              console.log('MongoDB disconnected'),
            );
            connection.on('reconnected', () =>
              console.log('MongoDB reconnected'),
            );
            connection.on('disconnecting', () =>
              console.log('MongoDB disconnecting'),
            );

            return connection;
          },
        };
      },
    }),
    CommonModule,
    UserModule,
    ProductModule,
  ],
})
export class AppModule {}
