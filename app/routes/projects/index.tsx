import { FaPhp, FaCss3, FaJs, FaHtml5, FaCode } from "react-icons/fa";

import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getGitHubRepos } from "~/models/github.server";
import type { Repo } from "~/models/github.server";
import { cache, DAY_IN_SECONDS } from "~/utils/cache.server";
import { FormatDate } from "~/components/FormatDate";
import { parseJSON } from "date-fns";

const REPO_QUERY = /* GraphQL */ `
  viewer {
    repositories(
      first: 100
      privacy: PUBLIC
      ownerAffiliations: [OWNER]
      isFork: false
      orderBy: {field: CREATED_AT, direction: DESC}
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        name
        owner {
          login
        }
        description
        updatedAt
        createdAt
      }
    }
  }
}
`;

export async function loader(args: LoaderArgs) {
  if (cache.has("GitHubRepos")) {
    // return json(cache.get("GitHubRepos"));
  }
  const repos = await getGitHubRepos();
  cache.set("GitHubRepos", repos, DAY_IN_SECONDS);
  return json(repos);
}

export default function Projects() {
  const repositoryList = useLoaderData<typeof loader>() as Repo[];

  const projects = repositoryList.map((repo: Repo) => {
    let language = repo.language.toLowerCase();

    let FaIcon = <FaJs />;
    switch (language) {
      case "typescript":
      case "javascript":
        FaIcon = <FaJs />;
        break;
      case "css":
        FaIcon = <FaCss3 />;
        break;
      case "html":
        FaIcon = <FaHtml5 />;
        break;
      case "php":
        FaIcon = <FaPhp />;
        break;
      case "shell":
        FaIcon = <FaCode />;

        break;
    }

    return (
      <div key={repo.name} className="">
        <h3 className="">
          <span className="faicon"> {FaIcon} </span>
          <a href={repo.html_url}>{repo.name}</a>
        </h3>

        <p className="">{repo.description}</p>
        <p>
          Stars: {repo.stargazers_count} &bull; Forks: {repo.forks_count}
        </p>
        <p>
          Created:{" "}
          <FormatDate date={parseJSON(repo.created_at)} pattern="d.M.yyyy" />{" "}
          &bull; Updated:{" "}
          <FormatDate date={parseJSON(repo.updated_at)} pattern="d.M.yyyy" />
        </p>
      </div>
    );
  });

  return (
    <>
      <div className="repos-wrapper">{projects}</div>
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <>
      <h1>Oh no!</h1>
      <p>{error.message}</p>
    </>
  );
}
