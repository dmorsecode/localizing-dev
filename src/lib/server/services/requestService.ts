import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

//Create Request
export const createRequest = async ({
	requestor_id,
	repo_url,
	status,
	description
}: {
	requestor_id: string;
	repo_url: string;
	status?: string;
	description?: string | null;
}) => {
	return await db
		.insert(schema.requests)
		.values({
			requestor_id,
			repo_url,
			status: status ?? 'open',
			description: description ?? null,
		})
		.returning();
};

// Get all requests
export const getAllRequests = async () => {

	const rows = await db
		.select({
			r_id: schema.requests.r_id,
			repo_url: schema.requests.repo_url,
			requestor_id: schema.requests.requestor_id,
			status: schema.requests.status,
			description: schema.requests.description,
			current_languages: {
				request_id: schema.cur_languages.request_id,
				language: schema.cur_languages.language
			},
			requested_languages: {
				request_id: schema.languages.request_id,
				language: schema.languages.language
			},
			tags: {
				request_id: schema.tags.request_id,
				tag: schema.tags.tag
			}
		})
		.from(schema.requests)
		.leftJoin(schema.tags, eq(schema.requests.r_id, schema.tags.request_id))
		.leftJoin(schema.cur_languages, eq(schema.requests.r_id, schema.cur_languages.request_id))
		.leftJoin(schema.languages, eq(schema.requests.r_id, schema.languages.request_id))

	//return null if no rows found
	if (rows.length === 0) return null;

	// Group by request id
	const return_request: Record<string, RequestWithLanguageAndTags> = {};

	for (const row of rows) {
		if (!return_request[row.r_id]) {
			return_request[row.r_id] = {
				r_id: row.r_id,
				repo_url: row.repo_url,
				requestor_id: row.requestor_id,
				status: row.status ?? 'open',
				description: row.description,
				tags: [],
				current_languages: [],
				requested_languages: []
			};
		}
		if (row.tags?.tag && !return_request[row.r_id].tags.includes(row.tags.tag)) {
			return_request[row.r_id].tags.push(row.tags.tag);
		}
		if (
			row.requested_languages?.language &&
			!return_request[row.r_id].requested_languages.includes(row.requested_languages.language)
		) {
			return_request[row.r_id].requested_languages.push(row.requested_languages.language);
		}
		if (
			row.current_languages?.language &&
			!return_request[row.r_id].current_languages.includes(row.current_languages.language)
		) {
			return_request[row.r_id].current_languages.push(row.current_languages.language);
		}
	}

	return Object.values(return_request);
};

//Get Request By Id
export const getRequestById = async (r_id: string) => {

	const rows = await db
		.select({
			r_id: schema.requests.r_id,
			repo_url: schema.requests.repo_url,
			requestor_id: schema.requests.requestor_id,
			status: schema.requests.status,
			description: schema.requests.description,
			current_languages: {
				request_id: schema.cur_languages.request_id,
				language: schema.cur_languages.language
			},
			requested_languages: {
				request_id: schema.languages.request_id,
				language: schema.languages.language
			},
			tags: {
				request_id: schema.tags.request_id,
				tag: schema.tags.tag
			}
		})
		.from(schema.requests)
		.leftJoin(schema.tags, eq(schema.requests.r_id, schema.tags.request_id))
		.leftJoin(schema.cur_languages, eq(schema.requests.r_id, schema.cur_languages.request_id))
		.leftJoin(schema.languages, eq(schema.requests.r_id, schema.languages.request_id))
		.where(eq(schema.requests.r_id, r_id));

		//return null if no rows found
	if (rows.length === 0) return null;

	const return_request: RequestWithLanguageAndTags = {
		r_id: rows[0].r_id,
		repo_url: rows[0].repo_url,
		requestor_id: rows[0].requestor_id,
		status: rows[0].status,
		description: rows[0].description,
		current_languages: [],
		requested_languages: [],
		tags: []
	};

	return_request.requested_languages = [
		...new Set(
			rows
				.map((row) => row.requested_languages?.language)
				.filter((language): language is string => language !== null && language !== undefined)
		)
	];

	return_request.current_languages = [
		...new Set(
			rows
				.map((row) => row.current_languages?.language)
				.filter((language): language is string => language !== null && language !== undefined)
		)
	];

	return_request.tags = [
		...new Set(
			rows
				.map((row) => row.tags?.tag)
				.filter((tag): tag is string => tag !== null && tag !== undefined)
		)
	];

	return return_request;
};

//Get All Requests by userId
export const getRequestsByUser = async (userId: string) => {

	const rows = await db
		.select({
			r_id: schema.requests.r_id,
			repo_url: schema.requests.repo_url,
			requestor_id: schema.requests.requestor_id,
			status: schema.requests.status,
			description: schema.requests.description,
			current_languages: {
				request_id: schema.cur_languages.request_id,
				language: schema.cur_languages.language
			},
			requested_languages: {
				request_id: schema.languages.request_id,
				language: schema.languages.language
			},
			tags: {
				request_id: schema.tags.request_id,
				tag: schema.tags.tag
			}
		})
		.from(schema.requests)
		.leftJoin(schema.tags, eq(schema.requests.r_id, schema.tags.request_id))
		.leftJoin(schema.cur_languages, eq(schema.requests.r_id, schema.cur_languages.request_id))
		.leftJoin(schema.languages, eq(schema.requests.r_id, schema.languages.request_id))
		.where(eq(schema.requests.requestor_id, userId));

		//return null if no rows found
		if (rows.length === 0) return null;

		// Group by request id
		const return_request: Record<string, RequestWithLanguageAndTags> = {};

		for (const row of rows) {
			if (!return_request[row.r_id]) {
				return_request[row.r_id] = {
					r_id: row.r_id,
					repo_url: row.repo_url,
					requestor_id: row.requestor_id,
					status: row.status ?? 'open',
					description: row.description,
					tags: [],
					current_languages: [],
					requested_languages: []
				};
			}
			if (row.tags?.tag && !return_request[row.r_id].tags.includes(row.tags.tag)) {
				return_request[row.r_id].tags.push(row.tags.tag);
			}
			if (
				row.requested_languages?.language &&
				!return_request[row.r_id].requested_languages.includes(row.requested_languages.language)
			) {
				return_request[row.r_id].requested_languages.push(row.requested_languages.language);
			}
			if (
				row.current_languages?.language &&
				!return_request[row.r_id].current_languages.includes(row.current_languages.language)
			) {
				return_request[row.r_id].current_languages.push(row.current_languages.language);
			}
		}

		return Object.values(return_request);
};

//Update a request
export const updateRequest = async (
	r_id: string,
	updates: Partial<typeof schema.requests.$inferInsert>
) => {
	return await db
		.update(schema.requests)
		.set(updates)
		.where(eq(schema.requests.r_id, r_id))
		.returning();
};

//Delete a request
export const deleteRequest = async (r_id: string) => {
	return await db.delete(schema.requests).where(eq(schema.requests.r_id, r_id));
};

//Types

type RequestWithLanguageAndTags = {
	r_id: string;
	repo_url: string;
	requestor_id: string;
	status: string | null;
	description: string | null;
	current_languages: string[];
	requested_languages: string[];
	tags: string[];
};
