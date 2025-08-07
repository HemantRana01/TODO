import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Todo, TodoStatus } from './todo.model';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { TodoQueryDto, PaginatedTodoResponseDto } from './dto/todo-query.dto';

@Injectable()
export class TodosService {
  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const todo = await Todo.query().insert({
      title: createTodoDto.title,
      description: createTodoDto.description,
      dueDate: createTodoDto.dueDate ? new Date(createTodoDto.dueDate) : undefined,
      userId: userId,
      status: createTodoDto.status || TodoStatus.PENDING,
      
    });

    return todo;
  }

  async findAll(userId: number): Promise<Todo[]> {
    return Todo.query()
      .where('userId', userId)
      .orderBy('createdAt', 'desc');
  }

  async findAllPaginated(userId: number, queryDto: TodoQueryDto): Promise<PaginatedTodoResponseDto> {
    const { 
      status, 
      dueDateFrom, 
      dueDateTo, 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = queryDto;

    // Build query
    let query = Todo.query().where('userId', userId);

    // Apply status filter
    if (status) {
      query = query.where('status', status);
    }

    // Apply due date range filters
    if (dueDateFrom) {
      query = query.where('dueDate', '>=', dueDateFrom);
    }

    if (dueDateTo) {
      query = query.where('dueDate', '<=', dueDateTo);
    }

    // Get total count for pagination
    const total = await query.clone().resultSize();

    // Apply pagination and sorting
    const offset = (page - 1) * limit;
    const todos = await query
      .orderBy(sortBy, sortOrder)
      .offset(offset)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
      data: todos,
    };
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await Todo.query()
      .where('id', id)
      .where('userId', userId)
      .first();

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);

    const updateData = {
      ...updateTodoDto,
      dueDate: updateTodoDto.dueDate ? new Date(updateTodoDto.dueDate) : undefined,
    };

    const updatedTodo = await Todo.query()
      .patchAndFetchById(id, updateData);

    return updatedTodo;
  }

  async remove(id: number, userId: number): Promise<void> {
    const todo = await this.findOne(id, userId);
    
    await Todo.query().deleteById(id);
  }

  async findByStatus(status: TodoStatus, userId: number): Promise<Todo[]> {
    return Todo.query()
      .where('userId', userId)
      .where('status', status)
      .orderBy('createdAt', 'desc');
  }

  async findOverdue(userId: number): Promise<Todo[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Todo.query()
      .where('userId', userId)
      .where('dueDate', '<', today)
      .whereNot('status', TodoStatus.COMPLETED)
      .orderBy('dueDate', 'asc');
  }

  async toggleStatus(id: number, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    const newStatus = todo.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED;
    return Todo.query().patchAndFetchById(id, { status: newStatus });
  }
  
} 