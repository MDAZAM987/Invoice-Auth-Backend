import { Controller, Get, Post, Body, Param, Put, Delete, HttpException,HttpStatus, Res,Request, UseGuards, ConflictException} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';


@Controller('permissions')
@ApiTags('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('access-token')
  async create(@Res() response:any,@Body() createPermissionDto: CreatePermissionDto,@Request() req: any): Promise<Permission> {
    try {
      // const user = req.user;
      // createPermissionDto.createdBy = user.userId;
      const createdPermission = await this.permissionService.create(createPermissionDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'permission has been created successfully',
        createdPermission,});
    }catch (error) {
      if (error instanceof ConflictException) {
        return response.status(HttpStatus.CONFLICT).json({
          message: error.message,
        });
      } else if (error.name === 'ValidationError') {
        const errorMessage = Object.values(error.errors)
          .map((val: any) => val.message)
          .join(', ');
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: errorMessage,
        });
      } else {
        console.error("Unexpected error:", error);
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Internal server error',
        });
      }
    }
  }

  @Get()
  async findAll(): Promise<Permission[]> {
    return this.permissionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Permission> {
    return this.permissionService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto,@Request() req: any): Promise<Permission> {
    // const user = req.user;
    // updatePermissionDto.updatedBy = user.userId;
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Permission> {
    return this.permissionService.delete(id);
  }
}
