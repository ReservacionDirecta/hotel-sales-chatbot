import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSalesScriptDto {
  @IsString()
  name: string;

  @IsString()
  content: string;

  @IsString()
  type: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class UpdateSalesScriptDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
