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
  first_name?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ example: true, description: 'User active status', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  first_name?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  last_name?: string;

  @ApiProperty({ example: true, description: 'User active status' })
  is_active: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Created at timestamp' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Updated at timestamp' })
  updated_at: Date;
}

export class UserProfileDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  first_name?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  last_name?: string;

  @ApiProperty({ example: true, description: 'User active status' })
  is_active: boolean;

  @ApiProperty({ example: 5, description: 'Number of todos' })
  todo_count: number;
} 