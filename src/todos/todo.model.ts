import { Model } from 'objection';
import { BaseModel } from '../database/base.model';
import { User } from '../users/user.model';

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
  due_date?: Date;
  user_id!: number;

  // Relationships
  user?: User;

  static get tableName() {
    return 'todos';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'status', 'user_id'],

      properties: {
        id: { type: 'integer' },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: ['string', 'null'] },
        status: { 
          type: 'string', 
          enum: Object.values(TodoStatus),
          default: TodoStatus.PENDING 
        },
        due_date: { type: ['string', 'object', 'null'], format: 'date' },
        user_id: { type: 'integer' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'todos.user_id',
          to: 'users.id',
        },
      },
    };
  }
} 