import { IsString, IsNumber, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  capacity: number;

  @IsNumber()
  price: number;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean = true;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  amenities?: string[];
}

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  amenities?: string[];
}
