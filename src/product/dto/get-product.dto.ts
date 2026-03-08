export class GetProductRequestDto {
  id: string;
}

export class GetProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
