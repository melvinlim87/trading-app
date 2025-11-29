import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ enum: ['PAPER', 'LIVE'], default: 'PAPER' })
  @IsIn(['PAPER', 'LIVE'])
  type: string;

  @ApiProperty({ required: false, default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;
}
