import { Module } from '@nestjs/common';
import { Product, ProductModel } from './model/product.model';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';
import { ProductRepository } from './repository/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductModel.schema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
