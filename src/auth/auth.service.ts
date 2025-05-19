import { Injectable, UnauthorizedException,ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    //console.log("Validated User",JSON.stringify(user, null, 2))
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      username: user.username,
      sub: user._id,
      email: user.email,

      firstName: user.firstName,
      lastName: user.lastName,
      role_id: user.role_id,
    };

    const payload1 = {
      username: user.username,
      sub: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    const refreshToken = this.jwtService.sign(payload1, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  

    await this.userService.updateUser(user._id, { refreshToken })

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if the user already exists
    const existingUser = await this.userService.findOneByUsername(registerDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
  
    // Hash the password
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
  
    // Generate a refresh token
    const refreshToken = this.jwtService.sign(
      { username: registerDto.username },
      { secret: this.configService.get<string>('JWT_REFRESH_SECRET') }
    );
  
    // Create the new user
    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
      refreshToken,
    });
  
    const { password, ...result } = user.toObject();
    return result;
  }

  async refreshToken(request: any) {
    try {
      const payload = request.user;
      
      const user = await this.userService.findOneById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const newPayload = {
        username: user.username,
        sub: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role_id: user.role_id
      };

      return {
        access_token: this.jwtService.sign(newPayload, { expiresIn: '1h' }),
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  
}
