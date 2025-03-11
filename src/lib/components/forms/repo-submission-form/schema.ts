import { z } from "zod";

export const formSchema = z.object({
	url: z.string().url("Please choose a repository."),
	description: z.string().min(2, { message: "Description must be between 2 and 500 characters." }).max(500, { message: "Description must be between 2 and 500 characters." }),
	tags: z.array(z.string().nonempty()),
	currentLangs: z.array(z.string()).min(1, { message: "Please choose at least one language." }),
	requestedLangs: z.array(z.string()).min(1, { message: "Please choose at least one language." }),
});

export type FormSchema = typeof formSchema;