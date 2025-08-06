import { Module } from '@nestjs/common';
import { Todo } from './todo.model';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  controllers: [TodosController],
  providers: [Todo, TodosService],
  exports: [Todo, TodosService],
})
export class TodosModule {}
