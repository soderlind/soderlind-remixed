import { z } from "zod";

import { ErrorBoundary } from "~/root";

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

export type Repo = z.infer<typeof RepoSchema>;
export type Repos = z.infer<typeof ReposSchema>;

export async function getGitHubRepos(): Promise<Repo[]> {
  const response = await fetch(
    "https://api.github.com/users/soderlind/repos?username=soderlind&type=owner&per_page=1000&sort=pushed&directionstring=desc",
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        Username: `${process.env.GITHUB_USERNAME}`,
      },
    }
  );

  const data = ReposSchema.parse(await response.json()); // as Repo[];

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
  }) as Repos;

  return projects.filter((project) => project !== undefined);
}
