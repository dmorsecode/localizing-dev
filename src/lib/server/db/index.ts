import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);

await db.execute(`
CREATE TABLE IF NOT EXISTS "user" (
	id text PRIMARY KEY,
	"githubId" integer NOT NULL UNIQUE,
	email text,
	username text NOT NULL,
	avatar text NOT NULL
);
CREATE TABLE IF NOT EXISTS "session" (
	id text PRIMARY KEY,
	user_id text REFERENCES "user" (id),
	expires_at timestamp with time zone NOT NULL
);
`);
