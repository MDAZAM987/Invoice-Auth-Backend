import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FieldPermissionDto {
  @ApiProperty({ description: 'Field name in the schema' }) // Add this line
  @IsNotEmpty()
  @IsString()
  readonly field: string; // Field name

  @ApiProperty({ description: 'List of allowed actions for this field' }) // Add this line
  @IsArray()
  @IsNotEmpty()
  readonly allowedActions: string[]; // Array of allowed actions for the field
}

class CreateRolePermissionDto {
  @ApiProperty({ description: 'Permission ID' }) // Add this line
  @IsNotEmpty()
  @IsMongoId() // Changed to IsMongoId for MongoDB ObjectId validation
  readonly permission: string; // Permission ID

  @ApiProperty({ description: 'List of allowed actions for this permission' }) // Add this line
  @IsArray()
  @IsNotEmpty()
  readonly allowedActions: string[]; // Array of allowed actions

  @ApiProperty({ type: [FieldPermissionDto], description: 'List of field permissions' }) // Add this line
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldPermissionDto)
  readonly fieldPermissions: FieldPermissionDto[]; // Field permissions
}

export class CreateRoleDto {
  @ApiProperty({ description: 'Role title' }) // Add this line
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({ type: [CreateRolePermissionDto], description: 'List of role permissions' }) // Add this line
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRolePermissionDto)
  readonly role_permissions: CreateRolePermissionDto[];


  // @ApiProperty({ description: 'ID of the user who created the permission' })
  // @IsMongoId()
  // createdBy: string;

  // @ApiProperty({ description: 'ID of the user who last updated the permission', required: false })
  // @IsOptional()
  // @IsMongoId()
  // updatedBy?: string;


}
