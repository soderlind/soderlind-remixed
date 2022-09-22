import { FaPhp, FaCss3, FaJs, FaHtml5, FaCode } from "react-icons/fa";

import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getGitHubRepos } from "~/models/github.server";
import type { Repo } from "~/models/github.server";
import { cache } from "~/utils/cache.server";
import { FormatDate } from "~/components/FormatDate";
import { parseJSON } from "date-fns";

// library.add(fab);
// library.add(faFileCode);

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
    const fontstyle = [
      {
        fontSize: "50px",
        // marginRight: "0.5rem",
        verticalAlign: "middle",
        float: "right",
      },
    ];
    let FaIcon = <FaJs className="faicon" />;
    switch (language) {
      case "typescript":
      case "javascript":
        FaIcon = <FaJs className="faicon" />;
        break;
      case "css":
        FaIcon = <FaCss3 className="faicon" />;
        break;
      case "html":
        FaIcon = <FaHtml5 className="faicon" />;
        break;
      case "php":
        FaIcon = <FaPhp className="faicon" />;
        break;
      case "shell":
        FaIcon = <FaCode className="faicon" />;

        break;
    }
    // let faIcon = language as IconName;
    // const icon = (
    //   <FontAwesomeIcon icon={[faLib, faIcon]} pull="right" border size="1x" />
    // );

    // console.log(icon);

    return (
      <div key={repo.name} className="">
        <h3 className="">
          {FaIcon} <a href={repo.html_url}>{repo.name}</a>
        </h3>

        <p className="">{repo.description}</p>
        <p>
          Stars: {repo.stargazers_count} &bull; Forks: {repo.forks_count}
        </p>
        <p>
          Created:{" "}
          <FormatDate date={parseJSON(repo.created_at)} timeZone="CET" /> &bull;
          Updated:{" "}
          <FormatDate date={parseJSON(repo.updated_at)} timeZone="CET" />
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
