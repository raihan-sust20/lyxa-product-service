import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import {
  CreateProductRequestDto,
  CreateProductResponseDto,
} from '../dto/create-product.dto';
import type {
  ListProductsRequestDto,
  ListProductsResponseDto,
  ProductItemDto,
} from '../dto/list-products.dto';
import { LoggerService } from '../../common/logger/logger.service';
import {
  DomainException,
  DomainExceptionCode,
} from '../../common/exceptions/domain.exception';
import type {
  GetProductRequestDto,
  GetProductResponseDto,
} from '../dto/get-product.dto';
import type { DeleteProductRequestDto, DeleteProductResponseDto } from '../dto/delete-product.dto';
import type { UpdateProductRequestDto, UpdateProductResponseDto } from '../dto/update-product.dto';

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

  async getProduct(
    dto: GetProductRequestDto,
    userId: string,
  ): Promise<GetProductResponseDto> {
    this.logger.log(
      `Fetching product id=${dto.id} for userId=${userId}`,
      ProductService.name,
    );

    const product = await this.productRepository.findByIdAndUserId(
      dto.id,
      userId,
    );

    if (!product) {
      throw new DomainException(
        `Product ${dto.id} not found`,
        DomainExceptionCode.NOT_FOUND,
      );
    }

    return this.toProductItem(product);
  }

  async listProducts(
    dto: ListProductsRequestDto,
    userId: string,
  ): Promise<ListProductsResponseDto> {
    const page = dto.page > 0 ? dto.page : 1;
    const limit = dto.limit > 0 ? dto.limit : 10;

    this.logger.log(
      `Listing products for userId=${userId} page=${page} limit=${limit}`,
      ProductService.name,
    );

    const { products, total } = await this.productRepository.findAllByUserId(
      userId,
      page,
      limit,
    );

    return {
      products: products.map((p) => this.toProductItem(p)),
      total,
      page,
      limit,
    };
  }

  async updateProduct(
    dto: UpdateProductRequestDto,
    userId: string,
  ): Promise<UpdateProductResponseDto> {
    this.logger.log(
      `Updating product id=${dto.id} for userId=${userId}`,
      ProductService.name,
    );

    const updated = await this.productRepository.updateByIdAndUserId(
      dto.id,
      userId,
      {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
      },
    );

    if (!updated) {
      throw new DomainException(
        `Product ${dto.id} not found`,
        DomainExceptionCode.NOT_FOUND,
      );
    }

    this.logger.log(
      `Product updated id=${dto.id} userId=${userId}`,
      ProductService.name,
    );

    return this.toProductItem(updated);
  }

  async deleteProduct(
    dto: DeleteProductRequestDto,
    userId: string,
  ): Promise<DeleteProductResponseDto> {
    this.logger.log(
      `Deleting product id=${dto.id} for userId=${userId}`,
      ProductService.name,
    );

    const deleted = await this.productRepository.deleteByIdAndUserId(
      dto.id,
      userId,
    );

    if (!deleted) {
      throw new DomainException(
        `Product ${dto.id} not found`,
        DomainExceptionCode.NOT_FOUND,
      );
    }

    this.logger.log(
      `Product deleted id=${dto.id} userId=${userId}`,
      ProductService.name,
    );

    return {
      success: true,
      message: `Product ${dto.id} deleted successfully`,
    };
  }

  // ── Private mappers ────────────────────────────────────────────────────────

  private toProductItem(product: any): ProductItemDto {
    return {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}
