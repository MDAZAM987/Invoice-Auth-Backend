import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.userModel
      .findById(id)
      .populate({
        path: 'role_id',
        populate: {
          path: 'role_permissions',
          populate: {
            path: 'permission',
            model: 'Permission',
          },
        },
      })
      .exec();
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel
      .find()
      .populate({
        path: 'role_id',
        populate: {
          path: 'role_permissions',
          populate: {
            path: 'permission',
            model: 'Permission',
          },
        },
      })
      .exec();
    return users.filter(user => user.role_id?.title !== 'Super Admin');
  }
  
  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userModel
      .findOne({ username })
      .populate({
        path: 'role_id',
        populate: {
          path: 'role_permissions',
          populate: {
            path: 'permission',
            model: 'Permission',
          },
        },
      })
      .exec();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.role_id === '') {
      updateUserDto.role_id = null;
    }
    if (updateUserDto.role_id) {
      const role = await this.roleModel.findById(updateUserDto.role_id).exec();

      if (!role) {
        throw new NotFoundException(
          `Role with ID ${updateUserDto.role_id} not found`,
        );
      }
      if (role.title === 'Super Admin') {
        const existingSuperAdmin = await this.userModel.findOne({
          role_id: role._id,
        });
        if (existingSuperAdmin && existingSuperAdmin._id.toString() !== id) {
          throw new BadRequestException(
            'Cannot assign Super Admin role to another user.',
          );
        }
      }
    }

    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return existingUser;
  }
  async updateUserProfileImage(
    userId: string,
    imageUrl: string,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    user.image = imageUrl;
    await user.save();
    return user;
  }

  async removeUserById(id: string): Promise<void> {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
