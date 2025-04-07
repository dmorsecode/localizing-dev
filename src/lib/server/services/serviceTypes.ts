export type GetRepositoriesOptions = {
	originalLanguage?: string | null;
    requestedLanguage?: string | null;
    minKb?: number | null;
    maxKb?: number | null;
    minStar?: number | null;
    maxStar?: number | null;
    licenseType?: string | null;
    tags?: string[] | null;
    page?: number;
	perPage?: number;
};