import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('todos').del();
  await knex('users').del();

  // Insert sample users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await knex('users').insert([
    {
      username: 'john_doe',
      hashed_password: hashedPassword,
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      is_active: true,
    },
    {
      username: 'jane_smith',
      hashed_password: hashedPassword,
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      is_active: true,
    },
    {
      username: 'john_musk',
      hashed_password: hashedPassword,
      email: 'musk@example.com',
      firstName: 'John',
      lastName: 'Musk',
      is_active: true,
    },
    {
      username: 'ted_mostby',
      hashed_password: hashedPassword,
      email: 'ted@example.com',
      firstName: 'ted',
      lastName: 'Mostby',
      is_active: true,
    },
  ]).returning('*');

  // Insert sample todos
  await knex('todos').insert([
    {
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the todo API',
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      userId: users[0].id,
    },
    {
      title: 'Review code changes',
      description: 'Review pull requests and provide feedback',
      status: 'in_progress',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      userId: users[0].id,
    },
    {
      title: 'Setup database migrations',
      description: 'Create and test database migration scripts',
      status: 'completed',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      userId: users[1].id,
    },
    {
      title: 'Plan next sprint',
      description: 'Organize tasks and priorities for the upcoming sprint',
      status: 'pending',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      userId: users[1].id,
    },
    {
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the todo API',
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      userId: users[0].id,
    },
    {
      title: 'Review code changes',
      description: 'Review pull requests and provide feedback',
      status: 'in_progress',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      userId: users[0].id,
    },
    {
      title: 'Setup database migrations',
      description: 'Create and test database migration scripts',
      status: 'completed',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      userId: users[1].id,
    },
    {
      title: 'Plan next sprint',
      description: 'Organize tasks and priorities for the upcoming sprint',
      status: 'pending',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      userId: users[1].id,
    },
  ]);
} 