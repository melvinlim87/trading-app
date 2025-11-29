import { IsIn, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  accountId: string;

  @ApiProperty()
  @IsUUID()
  instrumentId: string;

  @ApiProperty({ enum: ['BUY', 'SELL'] })
  @IsIn(['BUY', 'SELL'])
  side: string;

  @ApiProperty({ enum: ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'] })
  @IsIn(['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'])
  type: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stopPrice?: number;

  @ApiProperty({ required: false, default: 'DAY' })
  @IsOptional()
  @IsString()
  timeInForce?: string;
}
