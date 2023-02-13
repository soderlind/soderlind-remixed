import { FaPhp, FaCss3, FaJs, FaHtml5, FaCode } from "react-icons/fa";

import { defer, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Await, useCatch, useLoaderData } from "@remix-run/react";

import { parseJSON } from "date-fns";

import { getGitHubRepos } from "~/services/github.server";
import type { Repo } from "~/services/github.server";
import { cache, DAY_IN_SECONDS } from "~/utils/cache.server";
import { FormatDate } from "~/components/FormatDate";
import { Suspense } from "react";

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
            {getIcon(repo.language.toLowerCase())}{" "}
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

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <p>
      {/* {caught.status}: */}
      {caught.data}
    </p>
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
function getIcon(language: string) {
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
