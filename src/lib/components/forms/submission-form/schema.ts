import { z } from "zod";

export const submissionFormSchema = z.object({
	url: z.string().url("Please submit a link to your pull request."),
	providedLanguage: z.string().nonempty({ message: "Please choose at least one language." })
});

export type FormSchema = typeof submissionFormSchema;