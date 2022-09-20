/*
 * @see https://www.npmjs.com/package/node-cache
 */
import NodeCache from "node-cache";
let cache: NodeCache;

declare global {
  var __cache: NodeCache | undefined;
}
const cacheSettings = {
  stdTTL: 60 * 60 * 24,
  checkperiod: 60 * 60 * 24,
};

if (process.env.NODE_ENV === "production") {
  cache = new NodeCache(cacheSettings);
} else {
  if (!global.__cache) {
    global.__cache = new NodeCache(cacheSettings);
  }
  cache = global.__cache;
}

export { cache };
