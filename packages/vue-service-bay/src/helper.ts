import { glob } from "tinyglobby";
import { resolve } from "path";

export const getAllVueFiles = async (dir: string): Promise<string[]> => {
  const files = await glob("**/*.vue", {
    cwd: dir,
    ignore: ["node_modules"],
  });
  return files.map((file) => resolve(dir, file));
};
