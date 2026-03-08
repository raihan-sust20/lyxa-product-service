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
  ): Promise<HydratedDocument<Product>>
{
    const created = await this.productModel.create({
      user: userId,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
    });

    return created;
  }
}
