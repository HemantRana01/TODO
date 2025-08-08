import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
const hashedPassword = bcrypt.hash('password123', 10);

const usersData: Array<Record<string, any>> = [
  {
    username: 'john_doe',
    hashed_password: hashedPassword,
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Doe',
    is_active: true,
  },
  {
    username: 'jane_smith',
    hashed_password: hashedPassword,
    email: 'jane@example.com',
    first_name: 'Jane',
    last_name: 'Smith',
    is_active: true,
  },
  {
    username: 'john_musk',
    hashed_password: hashedPassword,
    email: 'musk@example.com',
    first_name: 'John',
    last_name: 'Musk',
    is_active: true,
  },
  {
    username: 'ted_mostby',
    hashed_password: hashedPassword,
    email: 'ted@example.com',
    first_name: 'ted',
    last_name: 'Mostby',
    is_active: true,
  },
];

export async function seed(knex: Knex) {
  const users = await knex('users').select('*');
  if (!users.length) {
    console.log('Seeding users...'); 
    await knex.batchInsert('users', usersData);
  } else console.log('Seeding users...not needed');
} 
