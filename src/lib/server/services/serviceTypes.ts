export type GetRepositoriesOptions = {
	originalLanguage?: string;
    requestedLanguage?: string;
    minKb?: string;
    maxKb?: string;
    licenseType?: string;
    tags?: string[];
    page?: number;
	perPage?: number;
};