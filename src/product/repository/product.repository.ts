import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Product } from '../model/product.model';
import { CreateProductRequestDto } from '../dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, type HydratedDocument } from 'mongoose';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(
    dto: CreateProductRequestDto,
    userId: string,
  ): Promise<Product & { _id?: any; createdAt?: Date; updatedAt?: Date }> {
    const created = await this.productModel.create({
      user: userId,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
    });

    return created.toObject();
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<
    | (Product & {
        _id?: any;
        createdAt?: Date;
        updatedAt?: Date;
      })
    | null
  > {
    const product = await this.productModel
      .findOne({ _id: id, user: userId })
      .lean()
      .exec();

    return product ?? null;
  }

  async findAllByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    products: (Product & { _id?: any; createdAt?: Date; updatedAt?: Date })[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    

    const [products, total] = await Promise.all([
      this.productModel
        .find({ user: userId })
        .find({})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments({ user: userId }).exec(),
    ]);

    return { products, total };
  }
}
