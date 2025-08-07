import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'john@example.com', description: 'User email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: true, description: 'User active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastName?: string;

  @ApiProperty({ example: true, description: 'User active status' })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Updated at timestamp' })
  updatedAt: Date;
}

export class UserProfileDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastName?: string;

  @ApiProperty({ example: true, description: 'User active status' })
  isActive: boolean;

  @ApiProperty({ example: 5, description: 'Number of todos' })
  todoCount: number;
} 