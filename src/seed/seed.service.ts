import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    await this.createSuperAdmin();
  }

  private async createSuperAdmin() {
    let superAdminRole = await this.roleService.findByTitle('Super Admin');
    if (!superAdminRole) {
      superAdminRole = await this.roleService.create({
        title: 'Super Admin',
        role_permissions: [],
      });
    }

    const superAdminUser = await this.userService.findOneByUsername('superadmin');
    if (!superAdminUser) {
      const hashedPassword = bcrypt.hashSync('securepassword', 10);
      await this.userService.createUser({
        username: 'superadmin',
        email: 'superadmin@example.com',
        password: hashedPassword,
        role_id: superAdminRole._id as string,
        firstName: 'Example',
        lastName: 'Name',
      });
      console.log('Super Admin user and role have been initialized.');
    } else {
      console.log('Super Admin user already exists. Skipping creation.');
    }
  }
}
