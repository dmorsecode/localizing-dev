import { z } from "zod";
import * as m from "$lib/paraglide/messages.js";

export const requestFormSchema = z.object({
	url: z.string().url(m.form_error_repo()),
	description: z.string().min(2, { message: m.form_error_description() }).max(500, { message: m.form_error_description() }),
	tags: z.array(z.string().nonempty()),
	currentLangs: z.array(z.string()).min(1, { message: m.form_error_language() }),
	requestedLangs: z.array(z.string()).min(1, { message: m.form_error_language() }),
});

export type FormSchema = typeof requestFormSchema;