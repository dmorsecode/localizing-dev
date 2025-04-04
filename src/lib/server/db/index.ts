import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(DATABASE_URL);
export const db = drizzle(client);

await db.execute(`

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
	expires_at timestamp with time zone NOT NULL,
	github_token text NOT NULL
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
	description text,
	created_at timestamp DEFAULT now(),
	expires_at timestamp DEFAULT (now() + '60 days'::interval)
);
CREATE TABLE IF NOT EXISTS languages (
	request_id TEXT NOT NULL REFERENCES "requests" (r_id) ON DELETE CASCADE,
	language TEXT NOT NULL,
	PRIMARY KEY (request_id, language)
);
CREATE TABLE IF NOT EXISTS tags (
	request_id TEXT NOT NULL REFERENCES "requests" (r_id) ON DELETE CASCADE,
	tag TEXT NOT NULL,
	PRIMARY KEY (request_id, tag)
);
CREATE TABLE IF NOT EXISTS "cur_languages" (
	request_id TEXT NOT NULL REFERENCES "requests" (r_id) ON DELETE CASCADE,
	language TEXT NOT NULL,
	PRIMARY KEY (request_id, language)
);
CREATE TABLE IF NOT EXISTS "submission" (
	s_id text PRIMARY KEY,
	request_id text NOT NULL REFERENCES "requests" (r_id),
	translator_id text NOT NULL REFERENCES "user" (id),
	pull_url text,
	provided_language text,
	submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	status text DEFAULT 'on review'::text,
	earned_points integer DEFAULT 0
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
CREATE TABLE IF NOT EXISTS "bookmarks" (
	user_id text NOT NULL REFERENCES "user" (id),
	request_id text NOT NULL REFERENCES "requests" (r_id),
	PRIMARY KEY (user_id, request_id)
);
`);
