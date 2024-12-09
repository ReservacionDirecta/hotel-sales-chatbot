import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  type: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  available: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}
