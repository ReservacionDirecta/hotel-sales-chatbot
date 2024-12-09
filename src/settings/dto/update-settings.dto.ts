import { IsString, IsOptional, IsEmail, Matches } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  timeZone?: string;

  @IsString()
  @IsOptional()
  welcomeMessage?: string;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Business hours must be in format HH:mm-HH:mm',
  })
  businessHours?: string;

  @IsEmail()
  @IsOptional()
  notificationEmail?: string;
}
