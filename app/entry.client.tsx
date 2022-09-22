// import { RemixBrowser } from "@remix-run/react";
// // import { hydrate } from "react-dom";
// import { hydrateRoot } from "react-dom/client";
// import { LocaleContextProvider } from "~/providers/LocaleProvider";

// // hydrate(<RemixBrowser />, document);
// const locales = window.navigator.languages;

// // hydrate(
// //   <LocaleContextProvider locales={locales}>
// //     <RemixBrowser />
// //   </LocaleContextProvider>,
// //   document
// // );

// hydrateRoot(
//   document,
//   <LocaleContextProvider locales={locales}>
//     <RemixBrowser />
//   </LocaleContextProvider>
// );
import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document, <RemixBrowser />);
