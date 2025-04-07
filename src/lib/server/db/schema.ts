import { relations } from 'drizzle-orm';
import { pgTable, text, integer, timestamp, boolean, primaryKey} from 'drizzle-orm/pg-core';

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
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	githubToken: text('github_token')
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
	status: text('status').default('open'),
	description: text('description'),
	kb_size: integer('kb_size'),
	star_size: integer('star_size'),
	license: text('license'),
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

export const cur_languages = pgTable('cur_languages', {
	request_id: text('request_id').notNull().references(() => requests.r_id),
	language: text('language').notNull(),
}, (table) => ({
	pk: primaryKey({columns: [table.request_id, table.language]})
}));

export const submission = pgTable('submission', {
	s_id: text('s_id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	request_id: text('request_id').notNull().references(() => requests.r_id),
	translator_id: text('translator_id').notNull().references(() => user.id),
	pull_url: text('pull_url'),
	provided_language: text('provided_language'),
	submitted_at: timestamp('submitted_at', { withTimezone: true}).defaultNow(),
	status: text('status').default('on review'),
	earned_points: integer('earned_points').default(0)
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

export const bookmarks = pgTable('bookmarks', {
	user_id: text('user_id').notNull().references(() => user.id),
	request_id: text('request_id').notNull().references(() => requests.r_id),
}, (table) => ({
	pk: primaryKey({ columns: [table.user_id, table.request_id]})
}));


/* RELATIONS */

export const requestRelations = relations(requests, ({ one, many }) => ({
	languages: many(languages),
	cur_languages: many(cur_languages),
	tags: many(tags),
	submissions: many(submission)
}));

export const userRelations = relations(user, ({ one, many }) => ({
	requests: many(requests),
	submissions: many(submission),
	bookmarks: many(bookmarks),
	leaderboard: one(leaderboard)
}));

export const languagesRelations = relations(languages, ({ one, many }) => ({
	request: one(requests, {
		fields: [languages.request_id],
		references: [requests.r_id]
	})
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
	request: one(requests, {
		fields: [tags.request_id],
		references: [requests.r_id]
	})
}));

export const cur_languagesRelations = relations(cur_languages, ({ one, many }) => ({
	request: one(requests, {
		fields: [cur_languages.request_id],
		references: [requests.r_id]
	})
}));

export const submissionRelations = relations(submission, ({ one, many }) => ({
	request: one(requests, {
		fields: [submission.request_id],
		references: [requests.r_id]
	}),
	translator: one(user, {
		fields: [submission.translator_id],
		references: [user.id]
	}),
}));

export const bookmarksRelations = relations(bookmarks, ({ one, many }) => ({
	user: one(user, {
		fields: [bookmarks.user_id],
		references: [user.id]
	}),
	request: one(requests, {
		fields: [bookmarks.request_id],
		references: [requests.r_id]
	})
}));

// Exporting inferred types
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Leaderboard = typeof leaderboard.$inferSelect;
export type Requests = typeof requests.$inferSelect;
export type Submission = typeof submission.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Notifications = typeof notifications.$inferSelect;
export type Languages = typeof languages.$inferSelect;
export type Tags = typeof tags.$inferSelect;
export type Cur_Languages = typeof cur_languages.$inferSelect;
export type Bookmarks = typeof bookmarks.$inferSelect;
export type RequestRelations = typeof requestRelations;
export type UserRelations = typeof userRelations;
export type LanguagesRelations = typeof languagesRelations;
export type TagsRelations = typeof tagsRelations;
export type Cur_LanguagesRelations = typeof cur_languagesRelations;
export type SubmissionRelations = typeof submissionRelations;
export type BookmarksRelations = typeof bookmarksRelations;