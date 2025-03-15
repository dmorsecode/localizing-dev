import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

//Create Request
export const createRequest = async ({
	requestor_id,
	repo_url,
	current_language,
	status
}: {
	requestor_id: string;
	repo_url: string;
	current_language: string;
	status?: string;
}) => {
	return await db
		.insert(schema.requests)
		.values({
			requestor_id,
			repo_url,
			current_language,
			status: status ?? 'open'
		})
		.returning();
};

//Get Request By Id
export const getRequestById = async (r_id: string) => {
	return await db.select().from(schema.requests).where(eq(schema.requests.r_id, r_id));
};

//Get All Requests by userId
export const getRequestsByUser = async (userId: string) => {
	return await db.select().from(schema.requests).where(eq(schema.requests.requestor_id, userId));
};

//Update a request
export const updateRequest = async (r_id: string, updates: Partial<typeof schema.requests.$inferInsert>) => {
    return await db
      .update(schema.requests)
      .set(updates)
      .where(eq(schema.requests.r_id, r_id))
      .returning();
  };

//Delete a request
export const deleteRequest = async (r_id: string) => {
    return await db
      .delete(schema.requests)
      .where(eq(schema.requests.r_id, r_id));
  };