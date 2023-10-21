import {
  manipulateHtml,
  manipulateScript,
  manipulateStyle,
  tsNodeIs,
  cssNodeIs,
} from "vue-service-bay";

/**
 * @param {import ('vue-service-bay').VueFile} vueFile
 */
export default (vueFile) => {
  const fileName = vueFile.filePath.split("/").pop().split(".").shift();
  let idIndex = 0;
  for (const block of vueFile.blocks) {
    if (block.type === "template") {
      // ----------------------------------------------------------------------
      // <template> example: Add id attribute to top level element.
      //
      // before: <div>
      // after : <div id="xxx">
      // ----------------------------------------------------------------------
      manipulateHtml(block, (node) => {
        if (node.parent.type !== "root") return;
        if (node.type === "tag") {
          idIndex += 1;
          node.attribs["id"] = `${fileName}${idIndex}`;
        }
      });
    } else if (block.type === "script") {
      // ----------------------------------------------------------------------
      // <script> example: Remove redudant type parameter.
      //
      // before: const inputValue = ref<string>("");
      // after : const inputValue = ref("");
      // ----------------------------------------------------------------------
      manipulateScript(block, (node) => {
        if (!tsNodeIs("VariableDeclarator", node)) return;
        const { init } = node;
        if (!tsNodeIs("CallExpression", init)) return;
        const { typeParameters } = init;
        if (!typeParameters) return;
        const { params } = typeParameters;
        if (params.length !== 1) return;
        const [param] = params;
        /** @type {"StringLiteral" | "NumericLiteral" | "BooleanLiteral" | "other"} */
        let type = "other";

        if (tsNodeIs("TSStringKeyword", param)) {
          type = "StringLiteral";
        } else if (tsNodeIs("TSNumberKeyword", param)) {
          type = "NumericLiteral";
        } else if (tsNodeIs("TSBooleanKeyword", param)) {
          type = "BooleanLiteral";
        }
        if (type === "other") return;

        const argumentsNode = init.arguments;
        if (argumentsNode.length !== 1) return;
        const [argument] = argumentsNode;
        if (!tsNodeIs(type, argument)) return;
        init.typeParameters = undefined;
      });
    } else if (block.type === "style") {
      // ----------------------------------------------------------------------
      // <style> example: Replace px to CSS variables.
      //
      // before: margin: 8px;
      // after : margin: var(--space-8);
      // ----------------------------------------------------------------------
      manipulateStyle(block, (node) => {
        if (!cssNodeIs("decl", node)) return;
        node.value = node.value
          .split(" ")
          .map((value) => {
            if (!value.endsWith("px")) {
              return value;
            }
            const number = value.replace("px", "");
            return `var(--space-${number})`;
          })
          .join(" ");
      });
    }
  }
};
