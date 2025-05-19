import { IsString, IsEmail, MinLength, MaxLength, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user', minLength: 1, maxLength: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  readonly firstName: string;

  @ApiProperty({ description: 'Last name of the user', minLength: 1, maxLength: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  readonly lastName: string;

  @ApiProperty({ description: 'Username of the user', minLength: 3, maxLength: 20 })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  readonly username: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'Password for the user', minLength: 6, maxLength: 100 })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  readonly password: string;

  @ApiProperty({ description: 'Refresh token for the user', required: false })
  @IsOptional()
  @IsString()
  readonly refreshToken?: string;

  @ApiProperty({ description: 'Profile image for the user', required: false })
  @IsOptional()
  @IsString()
  readonly image?: string;

  @ApiProperty({ description: 'Role ID assigned to the user', required: false })
  @IsOptional()
  @IsString()
  @IsMongoId()
  role_id?: string;
}
