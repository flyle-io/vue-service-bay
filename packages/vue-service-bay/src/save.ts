import type { VueFile } from "./parse.js";
import { writeFileSync } from "node:fs";

export const saveAsString = (vueFile: VueFile): string => {
  let updated = "";
  for (const block of vueFile.blocks) {
    const prefix = updated ? "\n\n" : "";
    updated += `${prefix}${block.openTag}${block.body}${block.closeTag}`;
  }
  return updated;
};

export const save = async (
  vueFile: VueFile,
  format?: (vueFileAsString: string) => Promise<string>,
) => {
  let updated = saveAsString(vueFile);
  if (format) {
    updated = await format(updated);
  }
  writeFileSync(vueFile.filePath, updated);
};
