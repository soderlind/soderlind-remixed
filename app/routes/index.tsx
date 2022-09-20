import { json, LoaderArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { parseJSON } from "date-fns";
import { getPosts, Post } from "~/models/post.server";
import { IntlDate } from "~/components/IntlDate";

export async function loader(args: LoaderArgs) {
  return redirect("/posts");
  // return json({ entries: await getPosts() });
}

// export default function Index() {
//   const data = useLoaderData<typeof loader>();

//   const entries = data.entries; // as Post[];
//   const years = Object.keys(entries) as string[];
//   const sortedYears = years.sort((a, b) => b.localeCompare(a));

//   const postsByYear = sortedYears.map((year) => {
//     const y = parseInt(year, 10);
//     const posts = entries[y] as unknown as any[];
//     const linksByYear = posts.map((post: Post) => (
//       <li
//         key={"post-" + post.slug}
//         className="post-preview"
//         id={"post-" + post.slug}
//       >
//         <Link to={"/posts/" + post.slug} className="">
//           <h2 className="title">
//             <span>{post.title}</span>
//           </h2>

//           <IntlDate date={parseJSON(post.updatedAt)} timeZone="CET" />
//         </Link>
//       </li>
//     ));
//     return (
//       <li key={year}>
//         <h3 className="list-title">
//           <Link to="#" className="">
//             {year}
//           </Link>
//         </h3>
//         <ul>{linksByYear}</ul>
//       </li>
//     );
//   });

//   const sticky = '<div className="sticky-arrow"></div>';
//   return (
//     <div className="section-inner">
//       <header className="page-header">
//         <h2 className="entry-title">Per Søderlind</h2>
//         <div className="excerpt">
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe eos
//           quis possimus cupiditate quo repellendus aliquam officiis veritatis,
//           tempora autem optio nulla aut consectetur expedita! Repellat eligendi
//           voluptates eius explicabo!
//         </div>
//       </header>
//       <div className="posts" id="posts">
//         <ul>{postsByYear}</ul>
//       </div>
//     </div>
//   );
// }
