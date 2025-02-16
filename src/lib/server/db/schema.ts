import { pgTable, serial, text, integer, timestamp} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	githubId: integer('githubId').notNull().unique(),
	email: text('email'),
	username: text('username').notNull(),
	avatar: text('avatar').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const leaderboard = pgTable('leaderboard', {
	L_ID: text('L_ID').primaryKey().$defaultFn(() => crypto.randomUUID()),
	userID: text('userID').notNull().references(() => user.id),
	L_Score: integer('L_Score').default(0)
});

export const requests = pgTable('requests', {
	R_ID: text('R_ID').primaryKey().$defaultFn(() => crypto.randomUUID()),
	requestor_id: text('requestor_id').notNull().references(() => user.id),
	repo_URL: text('repo_URL').notNull(),
	current_language: text('current_language').notNull(),
	requested_language: text('requested_language').notNull(),
	status: text('status').default('open'),
	created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	expires_at: timestamp('expired_at', { withTimezone: true})
});

export const submission = pgTable('submission', {
	S_ID: text('S_ID').primaryKey().$defaultFn(() => crypto.randomUUID()),
	request_id: text('request_id').notNull().references(() => requests.R_ID),
	translator_id: text('translator_id').notNull().references(() => user.id),
	pull_URL: text('pull_URL'),
	submitted_at: timestamp('submitted_at', { withTimezone: true}).defaultNow(),
	status: text('status').default('pending')
});

export const reviews = pgTable('reviews', {
	RV_ID: text('RV_ID').primaryKey().$defaultFn(() => crypto.randomUUID()),
	submission_id: text('submission_id').notNull().references(() => submission.S_ID),
	reviewer_id: text('reviewer_id').notNull().references(() => user.id),
	rating: integer('rating'),
	comments: text('comments'),
	reviewed_at: timestamp('reviewed_at', { withTimezone: true}).defaultNow()
});

// Exporting inferred types
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Leaderboard = typeof leaderboard.$inferSelect;
export type Requests = typeof requests.$inferSelect;
export type Submission = typeof submission.$inferSelect;
export type Review = typeof reviews.$inferSelect;