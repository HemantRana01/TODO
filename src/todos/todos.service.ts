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
      due_date: createTodoDto.due_date ? new Date(createTodoDto.due_date) : undefined,
      user_id: userId,
      status: createTodoDto.status || TodoStatus.PENDING,
    });

    return todo;
  }

  async findAll(userId: number): Promise<Todo[]> {
    return Todo.query()
      .where('user_id', userId)
      .orderBy('created_at', 'desc');
  }

  async findAllPaginated(userId: number, queryDto: TodoQueryDto): Promise<PaginatedTodoResponseDto> {
    const { 
      status, 
      due_date_from, 
      due_date_to, 
      page = 1, 
      limit = 10, 
      sort_by = 'created_at', 
      sort_order = 'desc' 
    } = queryDto;

    // Build query
    let query = Todo.query().where('user_id', userId);

    // Apply status filter
    if (status) {
      query = query.where('status', status);
    }

    // Apply due date range filters
    if (due_date_from) {
      query = query.where('due_date', '>=', due_date_from);
    }

    if (due_date_to) {
      query = query.where('due_date', '<=', due_date_to);
    }

    // Get total count for pagination
    const total = await query.clone().resultSize();

    // Apply pagination and sorting
    const offset = (page - 1) * limit;
    const todos = await query
      .orderBy(sort_by, sort_order)
      .offset(offset)
      .limit(limit);

    const total_pages = Math.ceil(total / limit);
    const has_next = page < total_pages;
    const has_prev = page > 1;

    return {
      page,
      limit,
      total,
      total_pages,
      has_next,
      has_prev,
      data: todos,
    };
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await Todo.query()
      .where('id', id)
      .where('user_id', userId)
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
      due_date: updateTodoDto.due_date ? new Date(updateTodoDto.due_date) : undefined,
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
      .where('user_id', userId)
      .where('status', status)
      .orderBy('created_at', 'desc');
  }

  async findOverdue(userId: number): Promise<Todo[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Todo.query()
      .where('user_id', userId)
      .where('due_date', '<', today)
      .whereNot('status', TodoStatus.COMPLETED)
      .orderBy('due_date', 'asc');
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