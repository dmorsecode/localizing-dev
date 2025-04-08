export type GetRepositoriesOptions = {
    repoName?: string | null;
    originalLanguage?: string[] | null;
    requestedLanguage?: string[] | null;
    minKb?: number | null;
    maxKb?: number | null;
    minStar?: number | null;
    maxStar?: number | null;
    licenseType?: string | null;
    tags?: string[] | null;
    page?: number;
	perPage?: number;
};

export type RequestWithLanguageAndTags = {
    r_id: string;
    repo_url: string;
    repo_name: string;
    requestor_id: string;
    status: string | null;
    description: string | null;
    kb_size: number | null;
    star_size: number | null;
    license: string | null;
    current_languages: { language: string }[];
    requested_languages: { language: string }[];
    tags: { tag: string }[];
  };
  