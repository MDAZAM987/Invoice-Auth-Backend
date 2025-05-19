import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Role, RoleSchema } from '../role/entities/role.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { User, UserSchema } from '../user/entities/user.entity';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    
  ],
  providers: [SeedService,UserService,RoleService],
  exports: [SeedService],
})
export class SeedModule {}
