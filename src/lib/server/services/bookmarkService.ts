import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { getRequestsFromList } from './requestService';
import * as schema from '$lib/server/db/schema';

//Create a bookmark
export const createBookmark = async ({
  user_id,
  request_id,
}: {
  user_id: string;
  request_id: string;
}) => {
  // Check if the bookmark already exists
  const existingBookmark = await db
    .select()
    .from(schema.bookmarks)
    .where(
      and(
        eq(schema.bookmarks.user_id, user_id),
        eq(schema.bookmarks.request_id, request_id)
      )
    );
  if (existingBookmark.length > 0) {
    return existingBookmark;
  }

  return await db.insert(schema.bookmarks).values({
    user_id,
    request_id,
  }).returning();
};

//Get bookmarks by userId
export const getBookmarksForUser = async (u_id: string, full: boolean = false) => {
  const rows = await db
    .select()
    .from(schema.bookmarks)
    .where(eq(schema.bookmarks.user_id, u_id));

    const requestIds = rows.map(row => row.request_id);

    const requests = await getRequestsFromList(requestIds);
    if (!requests) return [];

    if (full) return requests;

    // If full is false, then return only the request IDs instead of the entire request objects, in a nice little array.
    const bookmarks = requests.map(request => {
        return request.r_id;
    });

    return bookmarks;
};

//Delete a bookmark
export const deleteBookmark = async (user_id: string, request_id: string) => {
  return await db
    .delete(schema.bookmarks)
    .where(
      and(
        eq(schema.bookmarks.user_id, user_id),
        eq(schema.bookmarks.request_id, request_id)
      ))
    .returning();
};