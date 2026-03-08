export class ListProductsRequestDto {
  page: number;
  limit: number;
}

export class ListProductsResponseDto {
  products: ProductItemDto[];
  total: number;
  page: number;
  limit: number;
}

export class ProductItemDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
