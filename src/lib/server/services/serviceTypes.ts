export type GetRepositoriesOptions = {
	originalLanguage?: string | null;
    requestedLanguage?: string | null;
    minKb?: string | null;
    maxKb?: string | null;
    minStar?: string | null;
    maxStar?: string | null;
    licenseType?: string | null;
    tags?: string[] | null;
    page?: number;
	perPage?: number;
};