import { globby } from "globby";
import { resolve } from "path";

export const getAllVueFiles = async (dir: string): Promise<string[]> => {
  const files = await globby("**/*.vue", {
    cwd: dir,
    ignore: ["node_modules"],
  });
  return files.map((file) => resolve(dir, file));
};
