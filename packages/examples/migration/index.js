import { getAllVueFiles, parseVueFile, save } from "vue-service-bay";
import regexpExamples from "./001_RegexpExamples.js";
import astManipulateExamples from "./002_AstManipulateExamples.js";
import magicStringExamples from "./003_MagicStringExamples.js";
import { format } from "prettier";

/**
 * @param {import ('vue-service-bay').VueFile} vueFile
 */
const migrate = (vueFile) => {
  regexpExamples(vueFile);
  astManipulateExamples(vueFile);
  magicStringExamples(vueFile);
};

const main = async () => {
  const files = await getAllVueFiles("./src");
  for (const file of files) {
    const vueFile = await parseVueFile(file);
    migrate(vueFile);
    save(vueFile, (vueFileAsString) =>
      format(vueFileAsString, { parser: "vue" })
    );
  }
};

void main();
