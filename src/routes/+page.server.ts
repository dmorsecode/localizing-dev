// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';

export const ssr = true;
export const prerender = true;

export const load: PageServerLoad = async () => {
  return {};
};
