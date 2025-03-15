// src/routes/+page.server.ts
import { getUserFromGitHubId } from '$lib/server/services/userService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  
  const githubId = locals.user?.githubId ?? -1;

  const user = await getUserFromGitHubId(githubId);
  
  console.log('Loaded user from DB:', user);
  return {
    user,
  };
};
