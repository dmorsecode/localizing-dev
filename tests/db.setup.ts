import { PostgreSqlContainer } from '@testcontainers/postgresql';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from '../src/lib/server/db/schema';

export let testDb;
export let testSql;
let container;

export async function setupDb() {
  console.log('🔌 Starting PostgreSQL test container...');
  container = await new PostgreSqlContainer()
    .withDatabase('test_db')
    .withUsername('test')
    .withPassword('test')
    .start();

  const dbUrl = container.getConnectionUri(); // postgres://test:test@localhost:PORT/test_db

  console.log('✅ Connected to Postgres on:', dbUrl);

  testSql = postgres(dbUrl, { max: 1 });
  testDb = drizzle(testSql, { schema });

  await migrate(testDb, { migrationsFolder: './drizzle' });
  console.log('✅ setupDb complete');
}

export async function teardownDb() {
  console.log('🧹 Tearing down Postgres container...');
  await testSql?.end();
  await container?.stop();
}