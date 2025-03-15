import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

//Create a review
export const createReview = async ({
  submission_id,
  reviewer_id,
  rating,
  comments
}: {
  submission_id: string;
  reviewer_id: string;
  rating: number;
  comments?: string;
}) => {
  return await db.insert(schema.reviews).values({
    submission_id,
    reviewer_id,
    rating,
    comments
  }).returning();
};

//Get a review by ID
export const getReviewById = async (rv_id: string) => {
  const result = await db
    .select()
    .from(schema.reviews)
    .where(eq(schema.reviews.rv_id, rv_id))
    .limit(1);

  return result[0] ?? null;
};

//Get all reviews for a submission
export const getReviewsBySubmissionId = async (submission_id: string) => {
  return await db
    .select()
    .from(schema.reviews)
    .where(eq(schema.reviews.submission_id, submission_id));
};

//Get all reviews by reviewer
export const getReviewsByReviewerId = async (reviewer_id: string) => {
  return await db
    .select()
    .from(schema.reviews)
    .where(eq(schema.reviews.reviewer_id, reviewer_id));
};

//Update a review (e.g., change rating or comments)
export const updateReview = async (
  rv_id: string,
  updates: Partial<typeof schema.reviews.$inferInsert>
) => {
  return await db
    .update(schema.reviews)
    .set(updates)
    .where(eq(schema.reviews.rv_id, rv_id))
    .returning();
};

//Delete a review
export const deleteReview = async (rv_id: string) => {
  return await db
    .delete(schema.reviews)
    .where(eq(schema.reviews.rv_id, rv_id));
};
