import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

//Create a submission
export const createSubmission = async ({
  request_id,
  translator_id,
  pull_url,
  provided_language,
  earned_points,
  status = 'on review',
}: {
  request_id: string;
  translator_id: string;
  pull_url: string;
  provided_language: string;
  earned_points: number;
  status?: string;
}) => {
  return await db.insert(schema.submission).values({
    request_id,
    translator_id,
    pull_url,
    provided_language,
    earned_points,
    status
  }).returning();
};

//Get submission by ID
export const getSubmissionById = async (s_id: string) => {
  const result = await db
    .select()
    .from(schema.submission)
    .where(eq(schema.submission.s_id, s_id))
    .limit(1);

  return result[0] ?? null;
};

//Get all submissions for a request
export const getSubmissionsByRequestId = async (request_id: string) => {
  return await db
    .select()
    .from(schema.submission)
    .where(eq(schema.submission.request_id, request_id));
};

//Get all submissions by translator
export const getSubmissionsByTranslatorId = async (translator_id: string, merged: boolean = true) => {
  return await db
    .select()
    .from(schema.submission)
    .where(and(
      eq(schema.submission.translator_id, translator_id),
      merged ? eq(schema.submission.status, "merged") : undefined
    ))
};

// Get submission by pull_url
export const getSubmissionByPullUrl = async (pull_url: string) => {
  const result = await db
    .select()
    .from(schema.submission)
    .where(eq(schema.submission.pull_url, pull_url))
    .limit(1);

  return result[0] ?? null;
};

//Update a submission
export const updateSubmission = async (
  s_id: string,
  updates: Partial<typeof schema.submission.$inferInsert>
) => {
  return await db
    .update(schema.submission)
    .set(updates)
    .where(eq(schema.submission.s_id, s_id))
    .returning();
};

//Delete a submission
export const deleteSubmission = async (s_id: string) => {
  return await db
    .delete(schema.submission)
    .where(eq(schema.submission.s_id, s_id));
};
