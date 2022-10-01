/*
 * @see https://www.npmjs.com/package/node-cache
 */

import NodeCache from "node-cache";

export const MINUTE_IN_SECONDS = 60;
export const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;
export const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;
export const WEEK_IN_SECONDS = 7 * DAY_IN_SECONDS;
export const MONTH_IN_SECONDS = 30 * DAY_IN_SECONDS;
export const YEAR_IN_SECONDS = 365 * DAY_IN_SECONDS;
let cache: NodeCache;

declare global {
  var __cache: NodeCache | undefined;
}

if (process.env.NODE_ENV === "production") {
  cache = new NodeCache();
} else {
  if (!global.__cache) {
    global.__cache = new NodeCache();
  }
  cache = global.__cache;
}

export { cache };
