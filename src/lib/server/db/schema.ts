import { pgTable, serial, text, integer, timestamp, boolean, primaryKey} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	githubId: integer('githubId').notNull().unique(),
	email: text('email'),
	username: text('username').notNull(),
	avatar: text('avatar').notNull(),
	total_requests: integer('total_requests').default(0),
	total_submissions: integer('total_submissions').default(0),
	points: integer('points').default(0)
});

export const session = pgTable('session', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const leaderboard = pgTable('leaderboard', {
	l_id: text('l_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	user_id: text('user_id').notNull().references(() => user.id),
	l_score: integer('l_score').default(0),
	is_active: boolean('is_active').notNull().default(true)
});

export const requests = pgTable('requests', {
	r_id: text('r_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	requestor_id: text('requestor_id').notNull().references(() => user.id),
	repo_url: text('repo_url').notNull(),
	current_language: text('current_language').notNull(),
	status: text('status').default('open'),
	tag01: text('tag01'),
	tag02: text('tag02'),
	created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	expires_at: timestamp('expires_at', { withTimezone: true})
});

export const languages = pgTable('languages', {
	request_id: text('request_id').notNull().references(() => requests.r_id),
	language: text('language').notNull()
}, (table) => ({
	pk: primaryKey({ columns: [table.request_id, table.language]})
}));

export const tags = pgTable('tags', {
	request_id: text('request_id').notNull().references(() => requests.r_id),
	tag: text('tag').notNull(),
}, (table) => ({
	pk: primaryKey({ columns: [table.request_id, table.tag]})
}));

export const submission = pgTable('submission', {
	s_id: text('s_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	request_id: text('request_id').notNull().references(() => requests.r_id),
	translator_id: text('translator_id').notNull().references(() => user.id),
	pull_url: text('pull_url'),
	submitted_at: timestamp('submitted_at', { withTimezone: true}).defaultNow(),
	status: text('status').default('on review')
});

export const reviews = pgTable('reviews', {
	rv_id: text('rv_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	submission_id: text('submission_id').notNull().references(() => submission.s_id),
	reviewer_id: text('reviewer_id').notNull().references(() => user.id),
	rating: integer('rating'),
	comments: text('comments'),
	reviewed_at: timestamp('reviewed_at', { withTimezone: true}).defaultNow()
});

export const notifications = pgTable('notifications', {
	n_id: text('n_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	user_id: text('user_id').notNull().references(() => user.id),
	message: text('message').notNull(),
	type: text('type').default('info'),
	is_read: integer('is_read').default(0),
	created_at: timestamp('created_at', { withTimezone: true}).defaultNow()
});

// Exporting inferred types
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Leaderboard = typeof leaderboard.$inferSelect;
export type Requests = typeof requests.$inferSelect;
export type Submission = typeof submission.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Notifications = typeof notifications.$inferSelect;
export type Languages = typeof languages.$inferSelect;