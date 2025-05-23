import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

//Add a language to a request
export const addCurrentLanguageToRequest = async (request_id: string, language: string) => {
  return await db.insert(schema.cur_languages).values({ request_id, language });
};

//Get all languages for a request
export const getCurrentLanguagesByRequestId = async (request_id: string) => {
  return await db
    .select()
    .from(schema.cur_languages)
    .where(eq(schema.cur_languages.request_id, request_id));
};

//Delete a specific language from a request
export const deleteCurrentLanguageFromRequest = async (request_id: string, language: string) => {
    return await db
      .delete(schema.cur_languages)
      .where(
        and(
          eq(schema.cur_languages.request_id, request_id),
          eq(schema.cur_languages.language, language)
        )
      );
  };

//Delete all languages for a request
export const deleteAllCurrentLanguagesFromRequest = async (request_id: string) => {
  return await db
    .delete(schema.cur_languages)
    .where(eq(schema.cur_languages.request_id, request_id));
};
