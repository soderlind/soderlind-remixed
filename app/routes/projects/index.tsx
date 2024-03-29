import { FaPhp, FaCss3, FaJs, FaHtml5, FaCode } from "react-icons/fa";

import { defer, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Await,
  isRouteErrorResponse,
  useCatch,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { parseJSON } from "date-fns";

import { getGitHubRepos } from "~/services/github.server";
import type { Repo } from "~/services/github.server";
import { cache, DAY_IN_SECONDS } from "~/services/cache.server";
import { FormatDate } from "~/components/FormatDate";
import { Suspense } from "react";
import { isDefinitelyAnError } from "~/lib/utils";

export async function loader() {
  let repos = null;
  if (cache.has("GitHubRepos")) {
    repos = await cache.get("GitHubRepos");
  }
  if (!repos) {
    repos = await getGitHubRepos();
    cache.set("GitHubRepos", repos, DAY_IN_SECONDS);
  }

  if (repos !== null) {
    return json({ repos });
  }
  throw new Response("Error loading repos!");
}

export default function Projects() {
  const { repos } = useLoaderData<typeof loader>();
  const projects = repos.map((repo: Repo) => {
    return (
      <div key={repo.name} className="">
        <h3 className="">
          <span className="faicon">
            {" "}
            {getIcon((repo.language || "").toLowerCase())}{" "}
          </span>
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
          <FormatDate date={parseJSON(repo.pushed_at)} pattern="d.M.yyyy" />
        </p>
      </div>
    );
  });

  return <div className="repos-wrapper">{projects}</div>;
}

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = "Unknown error";
  if (isDefinitelyAnError(error)) {
    errorMessage = error.message;
  }

  return (
    <div>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <pre>{errorMessage}</pre>
    </div>
  );
}
function getIcon(language: string): JSX.Element {
  switch (language) {
    case "typescript":
    case "javascript":
      return <FaJs />;
    case "css":
      return <FaCss3 />;
    case "html":
      return <FaHtml5 />;
    case "php":
      return <FaPhp />;
    default:
      return <FaCode />;
  }
}
