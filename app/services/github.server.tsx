import { z } from "zod";

import { ErrorBoundary } from "~/root";

export type Repo = {
  fork: boolean;
  description: null;
  visibility: string;
  name: string;
  updated_at: string;
  created_at: string;
  pushed_at: string;
  html_url: string;
  forks_count: number;
  watchers_count: number;
  stargazers_count: number;
  language: string;
};

const RepoSchema = z.object({
  fork: z.boolean(),
  description: z.string().or(z.null()),
  visibility: z.string(),
  name: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
  pushed_at: z.string(),
  html_url: z.string(),
  forks_count: z.number(),
  watchers_count: z.number(),
  stargazers_count: z.number(),
  language: z.string().or(z.null()),
});

const ReposSchema = z.array(RepoSchema);

export async function getGitHubRepos(): Promise<Repo[]> {
  const response = await fetch(
    "https://api.github.com/users/soderlind/repos?username=soderlind&type=owner&per_page=1000&sort=pushed&directionstring=desc",
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        Username: "soderlind",
      },
    }
  );

  const data = ReposSchema.parse(await response.json()) as Repo[];

  const projects = data.map((repo: Repo) => {
    if (
      repo.fork === false &&
      repo.description !== null &&
      repo.visibility === "public"
    ) {
      return {
        name: repo.name,
        description: repo.description || "",
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        pushed_at: repo.pushed_at,
        html_url: repo.html_url,
        forks_count: repo.forks_count,
        watchers_count: repo.watchers_count,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
      };
    }
  }) as unknown as Repo[];

  return projects.filter((project) => project !== undefined);
}
