import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { UserSnapshotRepository } from '../repository/user-snapshot.repository';
import { LoggerService } from '../../common/logger/logger.service';

export interface UserRegisteredPayload {
  userId: string;
  email: string;
  name: string;
  timestamp: string;
}

@Injectable()
export class UserRegisteredHandler {
  private readonly CONTEXT = 'UserRegisteredHandler';

  constructor(
    private readonly userSnapshotRepository: UserSnapshotRepository,
    private readonly logger: LoggerService,
  ) {}

  @RabbitSubscribe({
    exchange: 'auth.events',
    routingKey: 'user.registered',
    queue: 'product-service.user-registered',
    queueOptions: {
      durable: true,
    },
  })
  async handle(payload: UserRegisteredPayload): Promise<void> {
    this.logger.log(
      `Received [user.registered] event for userId=${payload.userId}`,
      this.CONTEXT,
    );

    await this.userSnapshotRepository.upsert({
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    });

    this.logger.log(
      `User snapshot stored for userId=${payload.userId}`,
      this.CONTEXT,
    );
  }
}
