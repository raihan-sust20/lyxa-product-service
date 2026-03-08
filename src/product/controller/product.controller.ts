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
    const { userId, email } =
      this.userDataExtractService.extractUserData(metadata);
    return this.productService.createProduct(request, userId);
  }
}
