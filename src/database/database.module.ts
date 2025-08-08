import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import knex from 'knex';
import { Model,knexSnakeCaseMappers  } from 'objection';

const databaseProvider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async (configService: ConfigService) => {
    const knexInstance = knex({
      client: 'postgresql',
      connection: {
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        database: configService.get('DB_NAME', 'todo_dev'),
        user: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
      },
      pool: {
        min: 2,
        max: 10,
      },
      ...knexSnakeCaseMappers()
    });

    try {
      // Try a simple query to verify connection
      await knexInstance.raw('select 1');
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Failed to connect to the database', error);
      throw error;
    }

    // Bind Objection.js to the Knex instance
    Model.knex(knexInstance);

    return knexInstance;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {} 