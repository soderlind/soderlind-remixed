import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconName,
  IconPrefix,
  library,
} from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faFileCode } from "@fortawesome/free-solid-svg-icons";
import { json, LinksFunction, LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getGitHubRepos } from "~/models/github.server";
import type { Repo } from "~/models/github.server";
import { cache } from "~/utils/cache.server";
import { IntlDate } from "~/components/IntlDate";
import { parseJSON } from "date-fns";

library.add(fab);
library.add(faFileCode);

export async function loader(args: LoaderArgs) {
  if (cache.has("GitHubRepos")) {
    return json(cache.get("GitHubRepos"));
  }
  const repos = await getGitHubRepos();
  cache.set("GitHubRepos", repos, 60 * 60 * 24);
  return json(repos);
}

export default function Projects() {
  const repositoryList = useLoaderData<typeof loader>() as Repo[];
  const projects = repositoryList.map((repo: Repo) => {
    let language = repo.language.toLowerCase();
    let faLib: IconPrefix = "fab";
    switch (language) {
      case "javascript":
        language = "js";
        break;
      case "css":
        language = "css3";
        break;
      case "html":
        language = "html5";
        break;
      case "typescript":
        language = "typescript";
        break;
      case "shell":
        language = "file-code";
        faLib = "fas";
        break;
    }
    let faIcon = language as IconName;
    const icon = <FontAwesomeIcon icon={[faLib, faIcon]} pull="right" border />;
    return (
      <div key={repo.name} className="">
        <h3 className="">
          {icon} {}
          <a href={repo.html_url}>{repo.name}</a>
        </h3>

        <p className="">{repo.description}</p>
        <p>
          Stars: {repo.stargazers_count} &bull; Forks: {repo.forks_count}
        </p>
        <p>
          Created: <IntlDate date={parseJSON(repo.created_at)} timeZone="CET" />{" "}
          &bull; Updated:{" "}
          <IntlDate date={parseJSON(repo.updated_at)} timeZone="CET" />
        </p>
      </div>
    );
  });

  return (
    <div className="entry-content">
      <div className="repos-wrapper">{projects}</div>
    </div>
  );
}
