import { z } from "zod";

const numberInString = z.onumber().or(z.ostring()).transform((val, ctx) => {
	const parsed= parseInt(val as string ?? '');
	if (isNaN(parsed) && val !== '') {
	  ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "Please use digits only.",
	  });
	  return z.NEVER;
	} else if (val === '') return null;
	return parsed;
  }).nullable();

export const searchFilterFormSchema = z.object({
	repoName: z.ostring().nullable(),
	currentLang: z.ostring().nullable(),
	requestedLang: z.ostring().nullable(),
	minKb: numberInString,
	maxKb: numberInString,
	minStars: numberInString,
	maxStars: numberInString,
	license: z.ostring().nullable(),
	tags: z.array(z.string().nonempty()).optional().nullable(),
});

export type FormSchema = typeof searchFilterFormSchema;