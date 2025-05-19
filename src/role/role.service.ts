import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleModel.findOne({
      title: createRoleDto.title,
    });
    if (existingRole) {
      throw new ConflictException('Role title already exists');
    }
    const createdRole = new this.roleModel(createRoleDto);
    return createdRole.save();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel
      .find({ isDeleted: false })
      .populate({
        path: 'role_permissions',
        populate: {
          path: 'permission',
          model: 'Permission',
        },
      })
      .exec();
  }

  async findByTitle(title: string): Promise<Role | null> {
    return this.roleModel.findOne({ title }).exec();
  }
  

  async findById(id: string): Promise<Role> {
    return this.roleModel
      .findById(id)
      .populate({
        path: 'role_permissions',
        populate: {
          path: 'permission',
          model: 'Permission',
        },
      })
      .exec();
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid role ID');
    }
    const updatedRole = await this.roleModel
      .findByIdAndUpdate(id, updateRoleDto, { new: true })
      .exec();
    if (!updatedRole) {
      throw new NotFoundException(`Role not found for ${id}`);
    }
    return updatedRole;
  }

  async delete(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`role with ID ${id} not found`);
    }
    role.isDeleted = true;
    await role.save();
    return role;
  }
}
