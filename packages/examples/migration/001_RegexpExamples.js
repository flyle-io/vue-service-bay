/**
 * @param {import ('vue-service-bay').VueFile} vueFile
 */
export default (vueFile) => {
  for (const block of vueFile.blocks) {
    if (block.type === "template") {
      // ----------------------------------------------------------------------
      // <template> example: Rename <HelloWorld> to <SuperHelloWorld>.
      //
      // before: <HelloWorld>
      // after : <SuperHelloWorld>
      // ----------------------------------------------------------------------
      block.body = block.body.replace(/<HelloWorld/g, "<SuperHelloWorld");
    } else if (block.type === "script") {
      // ----------------------------------------------------------------------
      // <script> example: Add lang="ts" to <script>.
      //
      // before: <script>
      // after : <script lang="ts">
      // ----------------------------------------------------------------------
      if (!block.openTag.includes("lang=")) {
        block.openTag = block.openTag.replace(/<script/g, '<script lang="ts"');
      }
    } else if (block.type === "style") {
      // ----------------------------------------------------------------------
      // <style> example: Add TODO comment if language is scss.
      //
      // before: <style lang="scss">
      // after : <style>/** TODO: Do not use SCSS anymore. Because now CSS can use nested CSS. */
      // ----------------------------------------------------------------------
      if (block.openTag.includes("scss")) {
        block.body = `\n/** TODO: Do not use SCSS anymore. Because now CSS can use nested CSS. */\n${block.body}`;
      }
    }
  }
};
