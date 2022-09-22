import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";

import { animated, useSpring } from "react-spring";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { projectDetails } from "~/sanity/config";

import themeStyle from "./styles/style.css";
import fontStyles from "~/styles/fonts.css";
import fontAwesome from "~/styles/font-awesome.css";
import NavBar from "./components/NavBar";
import SocialLink from "./components/SocialLink";
import MobileMenu from "./components/MobileMenu";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: themeStyle },
    { rel: "stylesheet", href: fontStyles },
    { rel: "stylesheet", href: fontAwesome },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Per Søderlind",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader(args: LoaderArgs) {
  return json({ ENV: projectDetails() });
}

const activeClassName = "active";
export default function App() {
  const data = useLoaderData<typeof loader>();

  const [fullMenuVisible, setFullMenuVisible] = useState(false);
  const fullMenuAnimation = useSpring({
    transform: fullMenuVisible ? `translateY(0)` : `translateY(-100%)`,
    opacity: fullMenuVisible ? 1 : 0,
  });

  const { pathname } = useLocation();
  const isStudioRoute = pathname.startsWith("/studio");

  if (isStudioRoute) {
    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {isStudioRoute && typeof document === "undefined"
            ? "__STYLES__"
            : null}
        </head>
        <body>
          <Outlet />
          <ScrollRestoration />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
            }}
          />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  } else {
    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {isStudioRoute && typeof document === "undefined"
            ? "__STYLES__"
            : null}
        </head>
        <body className="page, full-width-template">
          <a className="skip-link button" href="#site-content">
            Skip to the content
          </a>
          <header className="site-header group">
            <h1 className="site-title">
              <a href="/" className="site-name">
                Per Søderlind
              </a>
            </h1>

            <div className="site-description">I code for fun</div>

            <div
              className="nav-toggle"
              onClick={() => setFullMenuVisible(!fullMenuVisible)}
            >
              <div className="bar"></div>
              <div className="bar"></div>
            </div>

            <div className="menu-wrapper">
              <ul className="main-menu desktop">
                <NavBar />
              </ul>
            </div>

            <div className="social-menu desktop">
              <SocialLink />
            </div>
          </header>

          <animated.div
            className="mobile-menu-wrapper"
            style={fullMenuAnimation}
          >
            <ul className="main-menu mobile">
              <MobileMenu />
            </ul>
          </animated.div>

          {/* <div className="mobile-menu-wrapper">

			<ul className="main-menu mobile">
				<?php
				if ( has_nav_menu( 'main-menu' ) ) {
					wp_nav_menu( $main_menu_args );
				} else {
					wp_list_pages( $fallback_args );
				}
				if ( ! get_theme_mod( 'mcluhan_hide_social', false ) ) : ?>
					<li className="toggle-mobile-search-wrapper"><a href="#" className="toggle-mobile-search"><?php _e( 'Search', 'mcluhan' ); ?></a></li>
				<?php endif; ?>
			</ul><!-- .main-menu.mobile -->

			<?php if ( has_nav_menu( 'social-menu' ) && ( ! get_theme_mod( 'mcluhan_hide_social', false ) || is_customize_preview() ) ) : ?>

				<div className="social-menu mobile">

					<ul className="social-menu-inner">

						<?php wp_nav_menu( $social_args ); ?>

					</ul><!-- .social-menu-inner -->

				</div><!-- .social-menu -->

			<?php endif; ?>

		</div><!-- .mobile-menu-wrapper --> */}

          {/* <?php if ( ! get_theme_mod( 'mcluhan_hide_social', false ) ) : ?> */}

          <div className="mobile-search">
            <div className="untoggle-mobile-search"></div>

            {/* <?php get_search_form(); ?> */}

            <div className="mobile-results">
              <div className="results-wrapper"></div>
            </div>
          </div>

          <div className="search-overlay">
            {/* <?php get_search_form(); ?> */}
          </div>

          {/* <?php endif; ?> */}

          <main
            className={!isStudioRoute ? "site-content" : "site-content-studio"}
            id="site-content"
            style={
              isStudioRoute
                ? {
                    height: "100%",
                    width: "100%",
                    top: 0,
                    position: "absolute",
                  }
                : {}
            }
          >
            <Outlet />
            <footer className="site-footer section-inner">
              <p className="copyright">
                &copy; 2022{" "}
                <a href="/" className="site-name">
                  soderlind.no
                </a>
              </p>
              {/* <p className="theme-by"><?php _e( 'Theme by', 'mcluhan' ); ?> <a href="https://andersnoren.se">Anders Nor&eacute;n</a></p> */}
            </footer>
          </main>
          <ScrollRestoration />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
            }}
          />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
}

// export function ErrorBoundary({ error }) {
//   console.log(error);
//   // return (
//   //   <Document>
//   //     <Layout>
//   //       <h1>Error</h1>
//   //       <p>{error.message}</p>
//   //     </Layout>
//   //   </Document>
//   // );
// }

// export function CatchBoundary() {
//   // const caught = useCatch();

//   return redirect("/404/");
// }
export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        {/* <Scripts /> */}
      </body>
    </html>
  );
}
