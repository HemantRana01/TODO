import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TodoStatus } from '../todo.model';

export class CreateTodoDto {
  @ApiProperty({ example: 'Complete project documentation', description: 'Todo title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Write comprehensive documentation for the todo API', description: 'Todo description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TodoStatus, example: TodoStatus.PENDING, description: 'Todo status', required: false })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;

  @ApiProperty({ example: '2024-12-31', description: 'Due date', required: false })
  @IsOptional()
  @IsDateString()
  due_date?: string;
}

export class UpdateTodoDto {
  @ApiProperty({ example: 'Complete project documentation', description: 'Todo title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Write comprehensive documentation for the todo API', description: 'Todo description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TodoStatus, example: TodoStatus.IN_PROGRESS, description: 'Todo status', required: false })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;

  @ApiProperty({ example: '2024-12-31', description: 'Due date', required: false })
  @IsOptional()
  @IsDateString()
  due_date?: string;
}

export class TodoResponseDto {
  @ApiProperty({ example: 1, description: 'Todo ID' })
  id: number;

  @ApiProperty({ example: 'Complete project documentation', description: 'Todo title' })
  title: string;

  @ApiProperty({ example: 'Write comprehensive documentation for the todo API', description: 'Todo description' })
  description?: string;

  @ApiProperty({ enum: TodoStatus, example: TodoStatus.PENDING, description: 'Todo status' })
  status: TodoStatus;

  @ApiProperty({ example: '2024-12-31', description: 'Due date' })
  due_date?: Date;

  @ApiProperty({ example: 1, description: 'User ID' })
  user_id: number;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Created at timestamp' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Updated at timestamp' })
  updated_at: Date;
} 