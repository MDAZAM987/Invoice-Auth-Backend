import { Controller, Post, Body, Get, Param, NotFoundException, BadRequestException, Put, Delete, UseGuards,Request } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('roles')
@ApiTags('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('access-token')
  async create(@Body() createRoleDto: CreateRoleDto,@Request() req: any,) {
    // const user = req.user;
    // createRoleDto.createdBy = user.userId;
    return this.roleService.create(createRoleDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('access-token')
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('access-token')
  async findById(@Param('id') id: string) {
    try {
      return await this.roleService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Role not found');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid role ID');
      }
      throw error;
    }
  }

  @Put(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('access-token')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Request() req: any,) {
    try {
      // const user = req.user;
      // updateRoleDto.updatedBy = user.userId;
      return await this.roleService.update(id, updateRoleDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Role not found');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid role ID');
      }
      throw error;
    }
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('access-token')
  async delete(@Param('id') id: string) {
    try {
      return await this.roleService.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Role not found');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid role ID');
      }
      throw error;
    }
  }
}
