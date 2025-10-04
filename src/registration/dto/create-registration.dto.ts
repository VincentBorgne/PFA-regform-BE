 
import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateRegistrationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  whatsapp: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  birthdate: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  tshirtSize: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsOptional()
  partnerWhatsapp?: string;

  @IsString()
  @IsOptional()
  partnerName?: string;

  @IsString()
  @IsNotEmpty()
  playerLevel: string;

  @IsString()
  @IsOptional()
  partnerLevel?: string;

  @IsObject()
  @IsOptional()
  tournaments?: Record<string, boolean>;

  @IsArray()
  @IsOptional()
  communityTournaments?: Array<{ name: string; contact: string }>;

  @IsArray()
  @IsOptional()
  rankings: Array<{ source: string; level: string }>;

  @IsString()
  @IsOptional()
  tennisSquashBackground?: string;
  
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  playtimeConstraint: string;

  @IsBoolean()
  @IsNotEmpty()
  termsAccepted: boolean;
}