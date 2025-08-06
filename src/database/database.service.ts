import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly knex: Knex,
  ) {}

  getKnex(): Knex {
    return this.knex;
  }

  async onModuleDestroy() {
    await this.knex.destroy();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.knex.raw('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }
} 