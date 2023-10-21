import {
  MagicString,
  walkTemplate,
  walkScript,
  walkStyle,
} from "vue-service-bay";

/**
 * @param {import ('vue-service-bay').VueFile} vueFile
 */
export default (vueFile) => {
  for (const block of vueFile.blocks) {
    if (block.type === "template") {
      // ----------------------------------------------------------------------
      // <template> example: Add wrapper component to the top-level <main>.
      //
      // before: <main>xxx</main>
      // after : <FooCompnent><main>xxx</main></FooCompnent>
      // ----------------------------------------------------------------------
      const magicString = new MagicString(block.body);
      walkTemplate(block, (node) => {
        if (
          node.parent.type === "root" &&
          node.type === "tag" &&
          node.name === "main"
        ) {
          magicString.prependLeft(node.startIndex, "<FooCompnent>\n");
          magicString.prependRight(node.endIndex + 1, "\n</FooCompnent>");
        }
      });
      block.body = magicString.toString();
    } else if (block.type === "script") {
      // ----------------------------------------------------------------------
      // <script> example: rename ref to vueRef.
      //
      // before: const inputValue = ref("");
      // after : const inputValue = vueRef("");
      // ----------------------------------------------------------------------
      const magicString = new MagicString(block.body);
      walkScript(block, (node) => {
        if (node.type === "ImportDeclaration") {
          if (node.source.value === "vue") {
            for (const specifier of node.specifiers) {
              if (specifier.imported.name === "ref") {
                magicString.overwrite(
                  specifier.start,
                  specifier.end,
                  "ref as vueRef"
                );
              }
            }
          }
        } else if (node.type === "CallExpression") {
          const { callee } = node;
          if (callee.type === "Identifier" && callee.name === "ref") {
            magicString.overwrite(callee.start, callee.end, "vueRef");
          }
        }
      });
      block.body = magicString.toString();
    } else if (block.type === "style") {
      // ----------------------------------------------------------------------
      // <style> example: Add TODO comment if type selector is used.
      //
      // before: header { ... }
      // after : /** TODO: Do not use type selector */ header { ... }
      // ----------------------------------------------------------------------
      const magicString = new MagicString(block.body);
      walkStyle(block, (node) => {
        if (node.type === "rule") {
          for (const part of node.selector.split(" ")) {
            if (part.match(/^[a-zA-Z-]+$/)) {
              const start = node.source?.start?.offset;
              if (start != null) {
                magicString.prependLeft(
                  start,
                  "/** TODO: Do not use type selector */\n"
                );
                break;
              }
            }
          }
        }
      });
      block.body = magicString.toString();
    }
  }
};
