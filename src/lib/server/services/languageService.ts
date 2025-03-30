import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

//Add a language to a request
export const addRequestedLanguageToRequest = async (request_id: string, language: string) => {
  return await db.insert(schema.languages).values({ request_id, language });
};

//Get all languages for a request
export const getRequestedLanguagesByRequestId = async (request_id: string) => {
  return await db
    .select()
    .from(schema.languages)
    .where(eq(schema.languages.request_id, request_id));
};

//Delete a specific language from a request
export const deleteRequestedLanguageFromRequest = async (request_id: string, language: string) => {
    return await db
      .delete(schema.languages)
      .where(
        and(
          eq(schema.languages.request_id, request_id),
          eq(schema.languages.language, language)
        )
      );
  };

//Delete all languages for a request
export const deleteAllRequestedLanguagesFromRequest = async (request_id: string) => {
  return await db
    .delete(schema.languages)
    .where(eq(schema.languages.request_id, request_id));
};
