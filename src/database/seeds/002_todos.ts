import { Knex } from 'knex';

const todosData: Array<Record<string, any>> = [
  {
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the todo API',
    status: 'pending',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    user_id: 1,
  },
  {
    title: 'Review code changes',
    description: 'Review pull requests and provide feedback',
    status: 'in_progress',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    user_id: 1,
  },
  {
    title: 'Setup database migrations',
    description: 'Create and test database migration scripts',
    status: 'completed',
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    user_id: 2,
  },
  {
    title: 'Plan next sprint',
    description: 'Organize tasks and priorities for the upcoming sprint',
    status: 'pending',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    user_id: 2,
  },
  {
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the todo API',
    status: 'pending',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    user_id: 3,
  },
  {
    title: 'Review code changes',
    description: 'Review pull requests and provide feedback',
    status: 'in_progress',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    user_id: 3,
  },
  {
    title: 'Setup database migrations',
    description: 'Create and test database migration scripts',
    status: 'completed',
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    user_id: 4,
  },
  {
    title: 'Plan next sprint',
    description: 'Organize tasks and priorities for the upcoming sprint',
    status: 'pending',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    user_id: 4,
  },
]
export async function seed(knex: Knex) {
  const todos = await knex('todos').select('*');
  if (!todos.length) {
    console.log('Seeding todos...');
    
    await knex.batchInsert('todos', todosData);
  } else console.log('Seeding todos...not needed');

} 
