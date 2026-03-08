import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { CreateProductRequestDto, CreateProductResponseDto } from '../dto/create-product.dto';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly logger: LoggerService,
  ) {}

  async createProduct(
    dto: CreateProductRequestDto,
    userId: string,
  ): Promise<CreateProductResponseDto> {
    this.logger.debug('Creating product with DTO', JSON.stringify(dto));
    this.logger.log(
      `Creating product "${dto.name}" for userId=${userId}`,
      ProductService.name,
    );

    const product = await this.productRepository.create(dto, userId);

    this.logger.log(
      `Product created id=${product._id} userId=${userId}`,
      ProductService.name,
    );

    return {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt!.toISOString(),
      updatedAt: product.updatedAt!.toISOString(),
    };
  }
}
