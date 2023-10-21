import MagicString from "magic-string";

export { MagicString };
export { is as tsNodeIs } from "@babel/types";

export { getAllVueFiles } from "./helper.js";
export type { VueFile } from "./parse.js";
export { parseVueFile } from "./parse.js";
export { save } from "./save.js";
export {
  walk as walkTemplate,
  manipulate as manipulateHtml,
} from "./languages/template.js";
export {
  walk as walkScript,
  manipulate as manipulateScript,
} from "./languages/script.js";
export {
  walk as walkStyle,
  manipulate as manipulateStyle,
  cssNodeIs,
} from "./languages/style.js";
