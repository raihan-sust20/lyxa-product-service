import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserSnapshot, UserSnapshotModel } from './model/user-snapshot.model';
import { UserSnapshotRepository } from './repository/user-snapshot.repository';
import { UserRegisteredHandler } from './events/user-registered.handler';
import { CommonModule } from '../common/common.module';
import { getModelForClass } from '@typegoose/typegoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSnapshot.name,
        schema: UserSnapshotModel.schema,
      },
    ]),
    CommonModule,
  ],
  providers: [UserSnapshotRepository, UserRegisteredHandler],
})
export class UserModule {}
