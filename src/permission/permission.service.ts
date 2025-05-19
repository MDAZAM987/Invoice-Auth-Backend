import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const existingPermission = await this.permissionModel.findOne({
      title: createPermissionDto.title,
    });
    if (existingPermission) {
      throw new ConflictException('Permission title already exists');
    }
    const createdPermission = new this.permissionModel(createPermissionDto);
    return createdPermission.save();
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<Permission> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid permission ID');
    }

    const permission = await this.permissionModel.findById(id).exec();

    if (!permission) {
      throw new BadRequestException('Permission not found');
    }

    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid permission ID');
    }

    const updatedPermission = await this.permissionModel
      .findByIdAndUpdate(id, updatePermissionDto, { new: true })
      .exec();

    if (!updatedPermission) {
      throw new BadRequestException('Permission not found');
    }

    return updatedPermission;
  }

  async delete(id: string): Promise<Permission> {
    const permission = await this.permissionModel.findById(id).exec();

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    permission.isDeleted = true;
    await permission.save();

    return permission;
  }
}
