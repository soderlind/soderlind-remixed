export type Repo = {
  fork: boolean;
  description: null;
  visibility: string;
  name: string;
  updated_at: string;
  created_at: string;
  html_url: string;
  forks_count: number;
  watchers_count: number;
  stargazers_count: number;
  language: string;
};

export async function getGitHubRepos() {
  const repositoriesResp = await fetch(
    "https://api.github.com/users/soderlind/repos?type=all&per_page=1000&sort=updated",
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  const repositories = await repositoriesResp.json();

  const projects = repositories.map((repo: Repo) => {
    if (repo.fork === false && repo.description !== null && repo.visibility === "public") {
      return {
        name: repo.name,
        description: repo.description || "",
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        html_url: repo.html_url,
        forks_count: repo.forks_count,
        watchers_count: repo.watchers_count,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
      };
    }
  });

  // remove undefined projects
  const filteredProjects = projects.filter((project: Object) => project !== undefined);

  return filteredProjects;
}
