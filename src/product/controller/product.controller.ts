import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard';
import type { AuthenticatedUser } from '../../common/guards/jwt-auth/authenticated-user.interface';
import { LogGrpc } from '../../common/decorators/log-grpc.decorator';
import { ProductService } from '../service/product.service';
import {
  CreateProductRequestDto,
  CreateProductResponseDto,
} from '../dto/create-product.dto';
import { UserDataExtractService } from '../../common/guards/jwt-auth/user-data-extract.service';
import type { Metadata } from '@grpc/grpc-js';
import type { GetProductRequestDto, GetProductResponseDto } from '../dto/get-product.dto';
import type { ListProductsRequestDto, ListProductsResponseDto } from '../dto/list-products.dto';

@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly userDataExtractService: UserDataExtractService,
  ) {}

  @GrpcMethod('ProductService', 'CreateProduct')
  @UseGuards(JwtAuthGuard)
  @LogGrpc()
  async createProduct(
    request: CreateProductRequestDto,
    metadata: Metadata,
  ): Promise<CreateProductResponseDto> {
    const { userId } =
      this.userDataExtractService.extractUserData(metadata);
    return this.productService.createProduct(request, userId);
  }

  @GrpcMethod('ProductService', 'GetProduct')
  @UseGuards(JwtAuthGuard)
  @LogGrpc()
  async getProduct(
    request: GetProductRequestDto,
    metadata: Metadata,
  ): Promise<GetProductResponseDto> {
    const { userId } =
      this.userDataExtractService.extractUserData(metadata);
    return this.productService.getProduct(request, userId);
  }

  @GrpcMethod('ProductService', 'ListProducts')
  @UseGuards(JwtAuthGuard)
  @LogGrpc()
  async listProducts(
    request: ListProductsRequestDto,
    metadata: Metadata,
  ): Promise<ListProductsResponseDto> {
    const { userId } =
      this.userDataExtractService.extractUserData(metadata);
    return this.productService.listProducts(request, userId);
  }
}
