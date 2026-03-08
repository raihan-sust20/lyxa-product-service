export class CreateProductRequestDto {
  name: string;

  description: string;

  price: number;

  stock: number;
}

/**
 * Maps to proto ProductResponse.
 */
export class CreateProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
