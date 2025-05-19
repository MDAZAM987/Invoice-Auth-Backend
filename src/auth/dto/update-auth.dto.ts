import { PartialType } from '@nestjs/mapped-types';
import { LoginDto, RegisterDto, RefreshTokenDto } from './create-auth.dto';

export class UpdateLoginDto extends PartialType(LoginDto) {}

export class UpdateRegisterDto extends PartialType(RegisterDto) {}

export class UpdateRefreshTokenDto extends PartialType(RefreshTokenDto) {}
