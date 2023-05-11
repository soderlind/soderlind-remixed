import type { PathLike } from "fs";
import { promises as fsp } from "fs";

export { promises as fsp } from "fs";
export { resolve, join } from "path";

/**
 * Find first file by partial name
 *
 * @see https://www.webmound.com/nodejs-find-files-matching-name-pattern-extension/
 * @param dir: PathLike - directory to search
 * @param name: string - name of file to search for
 * @returns Promise<string|null> - matched files or null.
 */
export const FindFirstFile = async (dir: PathLike, name: string) => {
  const files = (await fsp.readdir(dir)).sort((a, b) => b.localeCompare(a)); // sort by name descending
  for (const file of files) {
    if (file.includes(name)) {
      return file;
    }
  }

  return null;
};
