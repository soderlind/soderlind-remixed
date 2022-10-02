
import type { PathLike} from 'fs';
import { promises as fsp } from 'fs';

export { promises as fsp } from "fs";
export { resolve, join } from "path";

/**
 * Find files by name
 *
 * @see https://www.webmound.com/nodejs-find-files-matching-name-pattern-extension/
 * @param dir: PathLike - directory to search 
 * @param name: string - name of file to search for 
 * @returns Promise<string[]> - array of matched files 
 */
export  const findByName = async (dir: PathLike, name: string) => {
    const matchedFiles = [];

    const files = await fsp.readdir(dir);

    for (const file of files) {
        if (file.includes(name)) {
            matchedFiles.push(file);
        }
    }

    return matchedFiles;
};