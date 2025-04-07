import { eq, count, and, inArray, gte, lte, arrayOverlaps, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import * as serviceTypes from './serviceTypes';

//Create Request
export const createRequest = async ({
	requestor_id,
	repo_url,
	status,
	description,
	kb_size,
	star_size,
	license
}: {
	requestor_id: string;
	repo_url: string;
	status?: string;
	description?: string | null;
	kb_size: number;
	star_size: number;
	license?: string | null;
}) => {
	return await db
		.insert(schema.requests)
		.values({
			requestor_id,
			repo_url,
			status: status ?? 'open',
			description: description ?? null,
			kb_size: kb_size,
			star_size: star_size,
			license: license ?? null
		})
		.returning();
};

// Get all requests
export const getAllRequests = async (options: serviceTypes.GetRepositoriesOptions = {}) => {
	//defaults for inputs
	const {
		page = 1,
		perPage = 10,
		originalLanguage,
		requestedLanguage,
		minKb,
		maxKb,
		minStar,
		maxStar,
		licenseType,
		tags
	} = options;

	const offset = (page - 1) * perPage;

	//chain conditions
	const conditions = [];

	// if (originalLanguage) {
	// 	conditions.push(eq(schema.cur_languages.language, originalLanguage));
	// }

	// if (requestedLanguage) {
	// 	conditions.push(eq(schema.languages.language, requestedLanguage));
	// }

	 if (minKb) {
	 	conditions.push(gte(schema.requests.kb_size, minKb));
	 }

	if (maxKb) {
		conditions.push(lte(schema.requests.kb_size, maxKb));
	 }

	if (minStar)
	{
		conditions.push(gte(schema.requests.star_size, minStar));
	}

	if (maxStar)
	{
		conditions.push(lte(schema.requests.star_size, maxStar));
	}

	if (licenseType) {
	 	conditions.push(eq(schema.requests.license, licenseType));
	 }

	// if (tags?.length) {
	// 	conditions.push(inArray(schema.tags.tag, tags))
	// }

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	// const query = db.execute(sql`
	// 		SELECT
	// 			r.r_id,
	// 			r.repo_url,
	// 			r.requestor_id,
	// 			r.status,
	// 			r.description,
	// 			ARRAY_AGG(DISTINCT t.tag) AS tags,
	// 			ARRAY_AGG(DISTINCT cl.language) AS current_languages,
	// 			ARRAY_AGG(DISTINCT rl.language) AS requested_languages
	// 		FROM requests r
	// 		LEFT JOIN tags t ON r.r_id = t.request_id
	// 		LEFT JOIN cur_languages cl ON r.r_id = cl.request_id
	// 		LEFT JOIN languages rl ON r.r_id = rl.request_id
	// 		WHERE r.r_id IN  (
	// 			SELECT r_id
	// 			FROM requests
	// 			ORDER BY created_at DESC
	// 			LIMIT 10 OFFSET 0
	// 		)
	// 		GROUP BY r.r_id, r.repo_url, r.requestor_id, r.status,
	// 	`);
	
	const query = db.query.requests.findMany({
		limit: perPage,
		offset: offset,
		with: {
			tags: {
				columns: {
					tag: true
				},
			},
			cur_languages: {
				columns: {
					language: true
				}
			},
			languages: {
				columns: {
					language: true
				}
			}
		},
		where: whereClause	
	});

	//run query
	const rows = await query;

	//return null if no rows found
	if (rows.length === 0) return null;

	const total = await db.select({ count: count() }).from(schema.requests);
	const totalPages = Math.ceil(total[0].count / perPage);

	rows.filter(row => {
		if (tags?.length && !row.tags.some(tag => tags.includes(tag.tag))) return false;
		if (originalLanguage && !row.cur_languages.some(lang => lang.language === originalLanguage)) return false;
		if (requestedLanguage && !row.languages.some(lang => lang.language === requestedLanguage)) return false;

		return true;
	})

	return {
		data: rows,
		page,
		perPage,
		totalPages
	};
};

//Get Request By Id
export const getRequestById = async (r_id: string) => {
	const rows = await db.query.requests.findFirst({
		where: eq(schema.requests.r_id, r_id),
		with: {
			tags: {
				columns: {
					tag: true
				},
			},
			cur_languages: {
				columns: {
					language: true
				}
			},
			languages: {
				columns: {
					language: true
				}
			}
		},
	});

	//return null if no rows found
	if (!rows) return null;

	return rows;
};

//Get Request By Id
export const getRequestByRepoUrl = async (repo_url: string) => {
	const rows = await db.query.requests.findFirst({
		where: eq(schema.requests.repo_url, repo_url),
		with: {
			tags: {
				columns: {
					tag: true
				},
			},
			cur_languages: {
				columns: {
					language: true
				}
			},
			languages: {
				columns: {
					language: true
				}
			}
		},	
	});

	//return null if no row found
	if (!rows) return null;

	return rows;
};

export const getRequestsFromList = async (requestIds: string[]) => {
	const rows = await db.query.requests.findMany({
		where: inArray(schema.requests.r_id, requestIds),
		with: {
			tags: {
				columns: {
					tag: true
				},
			},
			cur_languages: {
				columns: {
					language: true
				}
			},
			languages: {
				columns: {
					language: true
				}
			}
		},	
	});

	//return null if no rows found
	if (rows.length === 0) return null;

	return rows;
}

//Get All Requests by userId
export const getRequestsByUser = async (userId: string) => {
	const rows = await db.query.requests.findMany({
		where: eq(schema.requests.requestor_id, userId),
		with: {
			tags: {
				columns: {
					tag: true
				},
			},
			cur_languages: {
				columns: {
					language: true
				}
			},
			languages: {
				columns: {
					language: true
				}
			}
		},	
	});

	//return null if no rows found
	if (rows.length === 0) return null;

	return rows;
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
	kb_size: number | null;
	star_size: number | null;
	license: string | null;
	current_languages: {request_id: string, language: string}[];
	requested_languages: {request_id: string, language: string}[];
	tags: {request_id: string, tag: string}[];
};


// For testing
export const getJoinedRequestById = async (r_id: string) => {
	const rows = await db.query.requests.findMany({
		where: eq(schema.requests.r_id, r_id),
		with: {
			tags: true,
			cur_languages: true,
			languages: true
		}
	});

	console.log(rows[0]);

	//return null if no rows found
	if (rows.length === 0) return null;

	return rows;
};