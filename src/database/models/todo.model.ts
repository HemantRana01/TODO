import { Model } from 'objection';
import { BaseModel } from './base.model';
import { User } from './user.model';

export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class Todo extends BaseModel {
  title!: string;
  description?: string;
  status!: TodoStatus;
  dueDate?: Date;
  userId!: number;

  // Relationships
  user?: User;

  static get tableName() {
    return 'todos';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'status', 'userId'],

      properties: {
        id: { type: 'integer' },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: ['string', 'null'] },
        status: { 
          type: 'string', 
          enum: Object.values(TodoStatus)
        },
        dueDate: { type: ['string', 'object', 'null'], format: 'date' },
        userId: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'todos.userId',
          to: 'users.id',
        },
      },
    };
  }
} 