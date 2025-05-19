import { Controller, Get, Post, Body, Param,Put,Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';


@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiExcludeEndpoint()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @ApiExcludeEndpoint()
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }


  // @UseGuards(RolesGuard) // Only allow Super Admins to hit this API
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('access-token')
  @Put(':id/assign-role')
  async assignRole(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOneById(id);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<User | undefined> {
    return this.userService.findOneByUsername(username);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.removeUserById(id);
  }
}
