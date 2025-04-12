import { eq, count, and, inArray, gte, lte, arrayOverlaps, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import * as serviceTypes from './serviceTypes';

//Create Request
export const createRequest = async ({
	requestor_id,
	repo_url,
	repo_name,
	status,
	description,
	kb_size,
	star_size,
	license
}: {
	requestor_id: string;
	repo_url: string;
	repo_name: string;
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
			repo_name,
			status: status ?? 'open',
			description: description ?? null,
			kb_size: kb_size,
			star_size: star_size,
			license: license ?? "none"
		})
		.returning();
};

// Get all requests
export const getAllRequests = async (options: serviceTypes.GetRepositoriesOptions = {}) => {
	//defaults for inputs
	const {
		page = 1,
		perPage = 10,
		repoName,
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

	if (repoName) {
		conditions.push(sql`r.repo_name ILIKE ${`%${repoName}%`}`);
	}

	if (originalLanguage) {
		conditions.push(sql`r.r_id IN (SELECT request_id FROM cur_languages WHERE language IN (${sql.join(originalLanguage.map(l => sql`${l}`), sql`, `)}))`);
	}

	if (requestedLanguage) {
		conditions.push(sql`r.r_id IN (SELECT request_id FROM languages	WHERE language IN (${sql.join(requestedLanguage.map(l => sql`${l}`), sql`, `)}))`);
	}

	if (minKb) {
		conditions.push(sql`r.kb_size >= ${minKb}`);
	}

	if (maxKb) {
		conditions.push(sql`r.kb_size <= ${maxKb}`);
	}

	if (minStar) {
		conditions.push(sql`r.star_size >= ${minStar}`);
	}

	if (maxStar) {
		conditions.push(sql`r.star_size <= ${maxStar}`);
	}

	if (licenseType) {
		conditions.push(sql`r.license = ${licenseType}`);
	}

	if (tags?.length) {
		conditions.push(sql`r.r_id IN (SELECT request_id FROM tags WHERE tag IN (${sql.join(tags.map(tag => sql`${tag}`), sql`, `)}))`);
	}

	const whereClause = conditions.length ? sql`WHERE ${sql.join(conditions, sql` AND `)}` : sql``;

	const query = db.execute(sql`
			SELECT
				r.r_id,
				r.requestor_id,
				r.repo_url,
				r.status,
				r.description,
				r.kb_size,
				r.star_size,
				r.license,
				r.created_at,
				r.expires_at,
				COALESCE(json_agg(DISTINCT jsonb_build_object('tag', t.tag)) FILTER (WHERE t.tag IS NOT NULL), '[]') AS tags,
				COALESCE(json_agg(DISTINCT jsonb_build_object('language', cl.language)) FILTER (WHERE cl.language IS NOT NULL), '[]') AS cur_languages,
				COALESCE(json_agg(DISTINCT jsonb_build_object('language', rl.language)) FILTER (WHERE rl.language IS NOT NULL), '[]') AS requested_languages
			FROM requests r
			LEFT JOIN tags t ON r.r_id = t.request_id
			LEFT JOIN cur_languages cl ON r.r_id = cl.request_id
			LEFT JOIN languages rl ON r.r_id = rl.request_id
			${whereClause}
			GROUP BY r.r_id, r.repo_url, r.requestor_id, r.status, r.description
			ORDER BY r.created_at DESC
    		LIMIT ${perPage} OFFSET ${offset}
		`);

	//run query
	const rows = (await query) as unknown as serviceTypes.RequestWithLanguageAndTags[];

	//return null if no rows found
	if (rows.length === 0) return null;

	const total = await db.execute(sql`SELECT COUNT(*) FROM requests r ${whereClause}`) as unknown as { count: number }[];
	const totalPages = Math.ceil(total[0].count / perPage);

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
			requested_languages: {
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
				}
			},
			cur_languages: {
				columns: {
					language: true
				}
			},
			requested_languages: {
				columns: {
					language: true
				}
			}
		}
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
				}
			},
			cur_languages: {
				columns: {
					language: true
				}
			},
			requested_languages: {
				columns: {
					language: true
				}
			}
		}
	});

	//return null if no rows found
	if (rows.length === 0) return null;

	return rows;
};

//Get All Requests by userId
export const getRequestsByUser = async (userId: string) => {
	const rows = await db.query.requests.findMany({
		where: eq(schema.requests.requestor_id, userId),
		with: {
			tags: {
				columns: {
					tag: true
				}
			},
			cur_languages: {
				columns: {
					language: true
				}
			},
			requested_languages: {
				columns: {
					language: true
				}
			}
		}
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