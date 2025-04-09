import { z } from "zod";
import * as m from "$lib/paraglide/messages.js";

export const submissionFormSchema = z.object({
	url: z.string().url(m.form_error_pr_link()),
	providedLanguage: z.string().nonempty({ message: m.form_error_language() }),
});

export type FormSchema = typeof submissionFormSchema;