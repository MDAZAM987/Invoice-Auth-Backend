import { Controller, Post, Req,Body,UseGuards, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/create-auth.dto';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { ApiTags,ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  @ApiBearerAuth('refresh-token')
  async refreshToken(@Req() request: any) {
    return this.authService.refreshToken(request);
  }
}
