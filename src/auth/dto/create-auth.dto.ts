import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Username of the user' }) // Add this line
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password of the user' }) // Add this line
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'Username of the user', minLength: 3, maxLength: 20 }) // Add this line
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({ description: 'Password for the user', minLength: 6, maxLength: 100 }) // Add this line
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ description: 'First name of the user', maxLength: 50 }) // Add this line
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', maxLength: 50 }) // Add this line
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ description: 'Email address of the user', maxLength: 255 }) // Add this line
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  email: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
