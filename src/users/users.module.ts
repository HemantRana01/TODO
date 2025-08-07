import { Module } from '@nestjs/common';
import { User } from '../database/models/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [User, UsersService],
  exports: [User, UsersService],
})
export class UsersModule {}
