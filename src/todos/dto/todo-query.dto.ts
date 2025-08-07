import { IsOptional, IsEnum, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TodoStatus } from '../todo.model';

export class TodoQueryDto {
  @ApiPropertyOptional({ 
    enum: TodoStatus, 
    example: TodoStatus.PENDING, 
    description: 'Filter by todo status' 
  })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;

  @ApiPropertyOptional({ 
    example: '2024-01-01', 
    description: 'Filter todos due from this date (inclusive)' 
  })
  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @ApiPropertyOptional({ 
    example: '2024-12-31', 
    description: 'Filter todos due until this date (inclusive)' 
  })
  @IsOptional()
  @IsDateString()
  dueDateTo?: string;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Page number (starts from 1)', 
    default: 1 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ 
    example: 10, 
    description: 'Number of items per page', 
    default: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ 
    example: 'createdAt', 
    description: 'Sort by field (createdAt, updatedAt, dueDate, title)',
    default: 'createdAt'
  })
  @IsOptional()
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'title' = 'createdAt';

  @ApiPropertyOptional({ 
    example: 'desc', 
    description: 'Sort order (asc, desc)',
    default: 'desc'
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class PaginatedTodoResponseDto {
  @ApiPropertyOptional({ example: 1, description: 'Current page number' })
  page: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  limit: number;

  @ApiPropertyOptional({ example: 25, description: 'Total number of items' })
  total: number;

  @ApiPropertyOptional({ example: 3, description: 'Total number of pages' })
  totalPages: number;

  @ApiPropertyOptional({ example: true, description: 'Whether there is a next page' })
  hasNext: boolean;

  @ApiPropertyOptional({ example: false, description: 'Whether there is a previous page' })
  hasPrev: boolean;

  @ApiPropertyOptional({ type: [Object], description: 'Array of todos' })
  data: any[];
} 