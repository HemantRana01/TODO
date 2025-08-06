import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('todos', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.enum('status', ['pending', 'in_progress', 'completed', 'cancelled']).defaultTo('pending')
    table.date('due_date');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('todos');
} 