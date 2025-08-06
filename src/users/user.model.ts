import { Model } from 'objection';
import { BaseModel } from '../database/base.model';
import { Todo } from '../todos/todo.model';

export class User extends BaseModel {
  username!: string;
  hashed_password!: string;
  email!: string;
  first_name?: string;
  last_name?: string;
  is_active!: boolean;

  // Relationships
  todos?: Todo[];

  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'hashed_password', 'email'],

      properties: {
        id: { type: 'integer' },
        username: { type: 'string', minLength: 1, maxLength: 255 },
        hashed_password: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        first_name: { type: ['string', 'null'], maxLength: 255 },
        last_name: { type: ['string', 'null'], maxLength: 255 },
        is_active: { type: 'boolean' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    return {
      todos: {
        relation: Model.HasManyRelation,
        modelClass: Todo,
        join: {
          from: 'users.id',
          to: 'todos.user_id',
        },
      },
    };
  }
} 