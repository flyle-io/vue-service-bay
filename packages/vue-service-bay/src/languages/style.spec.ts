import { describe, test, expect } from "vitest";
import * as scss from "./style.js";

describe("scss", () => {
  test("basic", async () => {
    const vueBlock = {
      type: "style",
      openTag: '<style lang="scss" scoped>',
      body: ".foo { &.bar: { color: red; } }",
      closeTag: "</style>",
    } as const;

    await scss.manipulate(vueBlock, (node) => {
      if (scss.cssNodeIs("rule", node)) {
        if (node.selector === ".foo") {
          node.selector = ".baz";
        }
      }
    });
    expect(vueBlock.body).toBe(".baz { &.bar: { color: red; } }");
  });
});
