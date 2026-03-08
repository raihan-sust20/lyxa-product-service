import { prop, getModelForClass, modelOptions, index, type Ref } from '@typegoose/typegoose';
import { UserSnapshot } from '../../user/model/user-snapshot.model';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({
  schemaOptions: {
    collection: 'products',
    timestamps: true,
  },
})
@index({ userId: 1 })
export class Product extends TimeStamps{
  /**
   * Denormalized reference to UserSnapshot.userId (a string UID, not an
   * ObjectId). Stored as a plain string so the field remains queryable
   * without a populate() call, while still expressing the ownership
   * relationship in the schema.
   */
  @prop({ required: true, ref: () => UserSnapshot, type: String })
  user: Ref<UserSnapshot, string>;

  @prop({ required: true, maxlength: 200 })
  name: string;

  @prop({ required: true, maxlength: 2000 })
  description: string;

  @prop({ required: true })
  price: number;

  @prop({ required: true, min: 0 })
  stock: number;
}

export const ProductModel = getModelForClass(Product);