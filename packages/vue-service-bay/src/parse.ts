import { readFileSync } from "node:fs";

export type VueBlock = {
  type: "template" | "script" | "style";
  openTag: string;
  body: string;
  closeTag: string;
};

export type VueFile = {
  filePath: string;
  blocks: VueBlock[];
};

const REGEXP_TEMPLATE = /(<(template).*?>)([\s\S]*)(<\/(template)>)/m;
const REGEXP_SCRIPT_STYLE =
  /(<(script|style).*?>)([\s\S]*?)(<\/(script|style)>)/m;

export const parseVueFile = async (filePath: string): Promise<VueFile> => {
  const file = readFileSync(filePath, "utf-8");
  const blocks: VueBlock[] = [];
  let index = 0;
  do {
    const remaining = file.substring(index);
    const matchedTemplate = remaining.match(REGEXP_TEMPLATE);
    const matchedScriptOrStyle = remaining.match(REGEXP_SCRIPT_STYLE);

    let match = matchedTemplate ?? matchedScriptOrStyle;
    if (matchedTemplate && matchedScriptOrStyle) {
      match =
        (matchedTemplate.index ?? 0) < (matchedScriptOrStyle.index ?? 0)
          ? matchedTemplate
          : matchedScriptOrStyle;
    }

    if (!match) break;

    let [all, openTag, , body, closeTag] = match ?? [];
    index += (match.index ?? 0) + all.length;

    if (all && openTag && body && closeTag) {
      if (openTag.startsWith("<template")) {
        blocks.push({ type: "template", openTag, body, closeTag });
      } else if (openTag.startsWith("<script")) {
        blocks.push({ type: "script", openTag, body, closeTag });
      } else if (openTag.startsWith("<style")) {
        blocks.push({ type: "style", openTag, body, closeTag });
      }
    }
  } while (true);

  return { filePath, blocks };
};
