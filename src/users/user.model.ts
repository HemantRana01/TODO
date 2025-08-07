import { Model } from 'objection';
import { BaseModel } from '../database/base.model';
import { Todo } from '../todos/todo.model';

export class User extends BaseModel {
  username!: string;
  hashedPassword!: string;
  email!: string;
  firstName?: string;
  lastName?: string;
  isActive!: boolean;

  // Relationships
  todos?: Todo[];

  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'hashedPassword', 'email'],

      properties: {
        id: { type: 'integer' },
        username: { type: 'string', minLength: 1, maxLength: 255 },
        hashedPassword: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        firstName: { type: ['string', 'null'], maxLength: 255 },
        lastName: { type: ['string', 'null'], maxLength: 255 },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
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
          to: 'todos.userId',
        },
      },
    };
  }
} 