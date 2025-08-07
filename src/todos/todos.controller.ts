import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto, TodoResponseDto } from './dto/todo.dto';
import { TodoQueryDto, PaginatedTodoResponseDto } from './dto/todo-query.dto';
import { TodoStatus } from './todo.model';

interface JwtUser {
  id: number;
  username: string;
  email: string;
}

@ApiTags('Todos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new todo',
    description: 'Create a new todo item for the authenticated user. The todo will be automatically linked to the user\'s account.'
  })
  @ApiBody({ 
    type: CreateTodoDto,
    description: 'Todo creation data'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Todo created successfully and linked to the authenticated user.',
    type: TodoResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input data or validation errors' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  async create(@Body() createTodoDto: CreateTodoDto ){
    const todo = await this.todosService.create(createTodoDto);
    return todo;
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all todos with pagination and filtering',
    description: 'Retrieve paginated list of todos for the authenticated user with advanced filtering options including status, due date range, and sorting.'
  })
  @ApiQuery({ name: 'status', required: false, enum: TodoStatus, description: 'Filter by todo status' })
  @ApiQuery({ name: 'dueDateFrom', required: false, type: String, description: 'Filter todos due from this date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'dueDateTo', required: false, type: String, description: 'Filter todos due until this date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'updatedAt', 'dueDate', 'title'], description: 'Sort field (default: createdAt)' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order (default: desc)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Paginated list of todos retrieved successfully with metadata.',
    type: PaginatedTodoResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid query parameters' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  async findAll(@Query() queryDto: TodoQueryDto, @CurrentUser() user: JwtUser): Promise<PaginatedTodoResponseDto> {
    return this.todosService.findAllPaginated(user.id, queryDto);
  }

  @Get('all')
  @ApiOperation({ 
    summary: 'Get all todos without pagination',
    description: 'Retrieve all todos for the authenticated user without pagination. Use this endpoint when you need all todos at once.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'All todos retrieved successfully.',
    type: [TodoResponseDto] 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  async findAllWithoutPagination(@CurrentUser() user: JwtUser): Promise<TodoResponseDto[]> {
    return this.todosService.findAll(user.id);
  }

  @Get('status/:status')
  @ApiOperation({ 
    summary: 'Get todos by status',
    description: 'Retrieve all todos for the authenticated user filtered by a specific status.'
  })
  @ApiParam({ name: 'status', enum: TodoStatus, description: 'Todo status to filter by' })
  @ApiResponse({ 
    status: 200, 
    description: 'Todos filtered by status retrieved successfully.',
    type: [TodoResponseDto] 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid status parameter' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  async findByStatus(
    @Param('status') status: TodoStatus,
    @CurrentUser() user: JwtUser,
  ): Promise<TodoResponseDto[]> {
    return this.todosService.findByStatus(status, user.id);
  }

  @Get('overdue')
  @ApiOperation({ 
    summary: 'Get overdue todos',
    description: 'Retrieve all overdue todos for the authenticated user. Overdue todos are those with due dates before today and status not completed.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Overdue todos retrieved successfully.',
    type: [TodoResponseDto] 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  async findOverdue(@CurrentUser() user: JwtUser): Promise<TodoResponseDto[]> {
    return this.todosService.findOverdue(user.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a specific todo by ID',
    description: 'Retrieve a specific todo by its ID. Users can only access their own todos.'
  })
  @ApiParam({ name: 'id', description: 'Todo ID', type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Todo found and retrieved successfully.',
    type: TodoResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Todo not found or does not belong to the authenticated user' 
  })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtUser): Promise<TodoResponseDto> {
    return this.todosService.findOne(+id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a todo',
    description: 'Update a specific todo by its ID. Users can only update their own todos.'
  })
  @ApiParam({ name: 'id', description: 'Todo ID', type: Number })
  @ApiBody({ 
    type: UpdateTodoDto,
    description: 'Todo update data'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Todo updated successfully.',
    type: TodoResponseDto 
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
    description: 'Todo not found or does not belong to the authenticated user' 
  })
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @CurrentUser() user: JwtUser,
  ){
    return this.todosService.update(+id, updateTodoDto, user.id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ 
    summary: 'Toggle TODO status between completed and pending',
    description: 'Toggle the status of a specific todo between completed and pending. Users can only toggle their own todos.'
  })
  @ApiParam({ name: 'id', description: 'Todo ID', type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Todo status toggled successfully.',
    type: TodoResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Todo not found or does not belong to the authenticated user' 
  })
  async toggleStatus(@Param('id') id: string, @CurrentUser() user: JwtUser): Promise<TodoResponseDto> {
    return this.todosService.toggleStatus(+id, user.id);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a todo',
    description: 'Delete a specific todo by its ID. Users can only delete their own todos. This action cannot be undone.'
  })
  @ApiParam({ name: 'id', description: 'Todo ID', type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Todo deleted successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Todo not found or does not belong to the authenticated user' 
  })
  async remove(@Param('id') id: string, @CurrentUser() user: JwtUser): Promise<void> {
    return this.todosService.remove(+id, user.id);
  }
} 