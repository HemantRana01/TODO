import { Injectable, NotFoundException, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { UpdateUserDto, UserResponseDto, UserProfileDto } from './dto/user.dto';
import { ChangePasswordDto } from './dto/password.dto';

@Injectable()
export class UsersService {
  async findById(id: number): Promise<User | null> {
    const user = await User.query().findById(id);
    return user || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await User.query().where('username', username).first();
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await User.query().where('email', email).first();
    return user || null;
  }

  async getProfile(userId: number): Promise<UserProfileDto> {
    const user = await User.query()
      .findById(userId)
      .withGraphFetched('todos');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      is_active: user.is_active,
      todo_count: user.todos?.length || 0,
    };
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being updated and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    const updatedUser = await User.query()
      .patchAndFetchById(userId, updateUserDto);

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      is_active: updatedUser.is_active,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { current_password, new_password, confirm_password } = changePasswordDto;

    // Validate password confirmation
    if (new_password !== confirm_password) {
      throw new BadRequestException('New password and confirmation password do not match');
    }

    // Get user with current password
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(current_password, user.hashed_password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await User.query()
      .patchAndFetchById(userId, { hashed_password: hashedNewPassword });
  }

  async deactivateUser(userId: number): Promise<void> {
    const user = await this.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await User.query()
      .patchAndFetchById(userId, { is_active: false });
  }

  async activateUser(userId: number): Promise<void> {
    const user = await this.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await User.query()
      .patchAndFetchById(userId, { is_active: true });
  }

  async getUserStats(userId: number): Promise<{
    total_todos: number;
    completed_todos: number;
    pending_todos: number;
    overdue_todos: number;
  }> {
    const user = await User.query()
      .findById(userId)
      .withGraphFetched('todos');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const todos = user.todos || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      total_todos: todos.length,
      completed_todos: todos.filter(todo => todo.status === 'completed').length,
      pending_todos: todos.filter(todo => todo.status === 'pending').length,
      overdue_todos: todos.filter(todo => 
        todo.dueDate && 
        new Date(todo.dueDate) < today && 
        todo.status !== 'completed'
      ).length,
    };
  }
} 