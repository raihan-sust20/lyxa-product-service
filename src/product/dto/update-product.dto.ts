export class UpdateProductRequestDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export class UpdateProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
