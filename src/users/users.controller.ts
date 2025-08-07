import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto, UserResponseDto, UserProfileDto } from './dto/user.dto';
import { ChangePasswordDto } from './dto/password.dto';

interface JwtUser {
  id: number;
  username: string;
  email: string;
}

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ 
    summary: 'Get current user profile',
    description: 'Retrieve the profile information of the currently authenticated user including todo count.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully with todo count.',
    type: UserProfileDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async getProfile(@CurrentUser() user: JwtUser): Promise<UserProfileDto> {
    return this.usersService.getProfile(user.id);
  }

  @Patch('profile')
  @ApiOperation({ 
    summary: 'Update current user profile',
    description: 'Update the profile information of the currently authenticated user. Email must be unique if changed.'
  })
  @ApiBody({ 
    type: UpdateUserDto,
    description: 'User profile update data'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile updated successfully.',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input data or validation errors' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Email already exists' 
  })
  async updateProfile(
    @CurrentUser() user: JwtUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(user.id, updateUserDto);
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Get current user statistics',
    description: 'Retrieve comprehensive statistics about the user\'s todos including counts by status and overdue items.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User statistics retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        totalTodos: { 
          type: 'number', 
          example: 10, 
          description: 'Total number of todos' 
        },
        completedTodos: { 
          type: 'number', 
          example: 5, 
          description: 'Number of completed todos' 
        },
        pendingTodos: { 
          type: 'number', 
          example: 3, 
          description: 'Number of pending todos' 
        },
        overdueTodos: { 
          type: 'number', 
          example: 2, 
          description: 'Number of overdue todos' 
        },
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async getUserStats(@CurrentUser() user: JwtUser) {
    return this.usersService.getUserStats(user.id);
  }

  @Post('change-password')
  @ApiOperation({ 
    summary: 'Change user password',
    description: 'Change the password of the currently authenticated user. Requires current password verification and strong password validation.'
  })
  @ApiBody({ 
    type: ChangePasswordDto,
    description: 'Password change data including current and new password'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password changed successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid password format or confirmation mismatch' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid current password or missing JWT token' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async changePassword(
    @CurrentUser() user: JwtUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Post('deactivate')
  @ApiOperation({ 
    summary: 'Deactivate current user account',
    description: 'Deactivate the account of the currently authenticated user. User will not be able to access protected endpoints.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User account deactivated successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async deactivateAccount(@CurrentUser() user: JwtUser): Promise<void> {
    return this.usersService.deactivateUser(user.id);
  }

  @Post('activate')
  @ApiOperation({ 
    summary: 'Activate current user account',
    description: 'Activate the account of the currently authenticated user. User will be able to access protected endpoints again.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User account activated successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async activateAccount(@CurrentUser() user: JwtUser): Promise<void> {
    return this.usersService.activateUser(user.id);
  }
} 