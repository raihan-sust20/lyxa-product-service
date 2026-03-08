import { prop, modelOptions, index } from '@typegoose/typegoose';
import { getModelForClass } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    collection: 'user_snapshots',
    timestamps: true,
  },
})
@index({ userId: 1 }, { unique: true })
export class UserSnapshot {
  @prop({ required: true })
  userId: string;

  @prop({ required: true })
  email: string;

  @prop({ required: true })
  name: string;
}

export const UserSnapshotModel = getModelForClass(UserSnapshot);
