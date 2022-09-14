import { Outlet, useLoaderData } from "@remix-run/react";
import ContentList from "~/components/ContentList";

export default function Index() {
  const outlet = (<Outlet />) as unknown as string;
  return (
    <ContentList
      title="Article"
      description="TODO: Add description"
      list={outlet}
    />
  );
}
