import { IsString, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Title of the permission' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Key of the table associated with the permission' })
  @IsString()
  tableKey: string; // New tableKey field

  // @ApiProperty({ description: 'ID of the user who created the permission' })
  // @IsMongoId()
  // createdBy: string;

  // @ApiProperty({ description: 'ID of the user who last updated the permission', required: false })
  // @IsOptional()
  // @IsMongoId()
  // updatedBy?: string;
}
