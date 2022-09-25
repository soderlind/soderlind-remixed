import { Link } from "@remix-run/react";

export default function NavBar() {
  return (
    <>
      <li key="posts">
        <Link to="/posts/" className="" prefetch="intent">
          Posts
        </Link>
      </li>
      <li key="projects">
        <Link to="/projects/" className="" prefetch="intent">
          Projects
        </Link>
      </li>
      <li key="archive">
        <Link to="/archive/" className="" prefetch="intent">
          Archive
        </Link>
      </li>
      <li key="about">
        <Link to="/about/" className="" prefetch="intent">
          About
        </Link>
      </li>
    </>
  );
}
