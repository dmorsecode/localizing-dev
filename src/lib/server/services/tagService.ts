import { eq, and, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

//Add a tag to a request
export const addTagToRequest = async (request_id: string, tag: string) => {
  return await db.insert(schema.tags).values({ request_id, tag });
};

//Add multiple tags to a request (bulk insert)
export const addTagsToRequest = async (request_id: string, tags: string[]) => {
  if (tags.length === 0) return [];

  const values = tags.map(tag => ({ request_id, tag }));
  return await db.insert(schema.tags).values(values);
};

//Get all tags for a request
export const getTagsByRequestId = async (request_id: string) => {
  return await db
    .select()
    .from(schema.tags)
    .where(eq(schema.tags.request_id, request_id));
};

//Delete a specific tag from a request
export const deleteTagFromRequest = async (request_id: string, tag: string) => {
  return await db
    .delete(schema.tags)
    .where(
      and(
        eq(schema.tags.request_id, request_id),
        eq(schema.tags.tag, tag)
      )
    );
};

//Delete all tags for a request
export const deleteAllTagsFromRequest = async (request_id: string) => {
  return await db
    .delete(schema.tags)
    .where(eq(schema.tags.request_id, request_id));
};

//Delete multiple specific tags from a request (optional)
export const deleteTagsFromRequest = async (request_id: string, tags: string[]) => {
  if (tags.length === 0) return;

  return await db
    .delete(schema.tags)
    .where(
      and(
        eq(schema.tags.request_id, request_id),
        inArray(schema.tags.tag, tags)
      )
    );
};
