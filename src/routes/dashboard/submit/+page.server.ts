import type { Actions } from "./$types.js";
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "$lib/components/forms/repo-submission-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import type { RequestEvent } from '../../../../.svelte-kit/types/src/routes/dashboard/$types';

// export const load: PageServerLoad = async () => {
//
// 	return {
// 		form: await superValidate(zod(formSchema)),
// 	};
// };

export async function load(event: RequestEvent) {
	const repos = await fetch(`https://api.github.com/users/${event.locals.user?.username}/repos`);
	const reposJson = await repos.json();

	return {
		form: await superValidate(zod(formSchema)),
		repos: reposJson
	};
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		const url = new URL(form.data.url);
		if (url.hostname !== "github.com" || url.pathname.split("/")[1] !== event.locals.user?.username) {
			return fail(400, {
				form,
			});
		}

		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		// TODO: Save data to the database.

		// redirect to dashboard
		redirect(303, "/dashboard");

		return {
			form,
		};
	},
};