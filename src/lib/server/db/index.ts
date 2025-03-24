import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);

//DROP TABLE IF EXISTS "notifications" CASCADE;
//DROP TABLE IF EXISTS "reviews" CASCADE;
//DROP TABLE IF EXISTS "submission" CASCADE;
//DROP TABLE IF EXISTS "languages" CASCADE;
//DROP TABLE IF EXISTS "tags" CASCADE;
//DROP TABLE IF EXISTS "current_languages" CASCADE,
//DROP TABLE IF EXISTS "requests" CASCADE;
//DROP TABLE IF EXISTS "leaderboard" CASCADE;
//DROP TABLE IF EXISTS "session" CASCADE;
//DROP TABLE IF EXISTS "user" CASCADE;

await db.execute(`

DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "reviews" CASCADE;
DROP TABLE IF EXISTS "submission" CASCADE;
DROP TABLE IF EXISTS "languages" CASCADE;
DROP TABLE IF EXISTS "tags" CASCADE;
DROP TABLE IF EXISTS "current_languages" CASCADE;
DROP TABLE IF EXISTS "requests" CASCADE;
DROP TABLE IF EXISTS "leaderboard" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE IF NOT EXISTS "user" (
	id text PRIMARY KEY,
	"githubId" integer NOT NULL UNIQUE,
	email text,
	username text NOT NULL,
	avatar text NOT NULL,
	total_requests INTEGER DEFAULT 0,
	total_submissions INTEGER DEFAULT 0,
	points INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS "session" (
	id text PRIMARY KEY,
	user_id text REFERENCES "user" (id),
	expires_at timestamp with time zone NOT NULL
);
CREATE TABLE IF NOT EXISTS "leaderboard" (
	l_id text PRIMARY KEY,
	user_ID text NOT NULL REFERENCES "user" (id),
	l_score integer DEFAULT 0,
	is_active BOOLEAN DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS "requests" (
	r_id text PRIMARY KEY,
	requestor_id text NOT NULL REFERENCES "user" (id),
	repo_URL text NOT NULL,
	status text DEFAULT 'open',
	description text NOT NULL,
	created_at timestamp DEFAULT now(),
	expires_at timestamp DEFAULT (now() + '60 days'::interval)
);
CREATE TABLE IF NOT EXISTS languages (
	request_id TEXT NOT NULL REFERENCES "requests" (r_id) ON DELETE CASCADE,
	language TEXT NOT NULL,
	PRIMARY KEY (request_id, language)
);
CREATE TABLE IF NOT EXISTS current_languages (
	request_id TEXT NOT NULL REFERENCES "requests" (r_id) ON DELETE CASCADE,
	language TEXT NOT NULL,
	PRIMARY KEY (request_id, language)
);
CREATE TABLE IF NOT EXISTS tags (
	request_id TEXT NOT NULL REFERENCES "requests" (r_id) ON DELETE CASCADE,
	tag TEXT NOT NULL,
	PRIMARY KEY (request_id, tag)
);
CREATE TABLE IF NOT EXISTS "submission" (
	s_id text PRIMARY KEY,
	request_id text NOT NULL REFERENCES "requests" (r_id),
	T_ID text NOT NULL REFERENCES "user" (id),
	pull_URL text,
	submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	status text DEFAULT 'on review'::text
);
CREATE TABLE IF NOT EXISTS "reviews" (
	rv_id text PRIMARY KEY,
	submission_id text NOT NULL REFERENCES "submission" (s_id),
	reviewer_id text NOT NULL REFERENCES "user" (id),
	rating integer,
	comments text,
	reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "notifications" (
	n_id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL REFERENCES "user" (id),
	message TEXT NOT NULL,
	type TEXT DEFAULT 'info',
	is_read INTEGER DEFAULT 0,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_current_languages_language ON current_languages(language);
CREATE INDEX IF NOT EXISTS idx_languages_language ON languages(language);
CREATE INDEX IF NOT EXISTS idx_tags_tag ON tags(tag);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_submission_status ON submission(status);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(l_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_username ON "user"(username);

`);