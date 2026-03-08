import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { UserSnapshot } from '../model/user-snapshot.model';

export interface UserSnapshotData {
  userId: string;
  email: string;
  name: string;
}

@Injectable()
export class UserSnapshotRepository {
  constructor(
    @InjectModel(UserSnapshot.name)
    private readonly userSnapshotModel: Model<UserSnapshot>,
  ) {}

  async upsert(data: UserSnapshotData): Promise<UserSnapshot> {
    return this.userSnapshotModel
      .findOneAndUpdate(
        { userId: data.userId },
        { $set: data },
        { upsert: true, new: true },
      )
      .lean()
      .exec();
  }

  async findByUserId(userId: string): Promise<UserSnapshot | null> {
    return this.userSnapshotModel
      .findOne({ userId })
      .lean()
      .exec();
  }
}
