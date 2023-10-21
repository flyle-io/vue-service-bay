import { describe, test, expect } from "vitest";
import * as typescript from "./script";

describe("typescript", () => {
  test("javascript", async () => {
    const vueBlock = {
      type: "script",
      openTag: '<script lang="ts">',
      body: 'console.log("hello");',
      closeTag: "</script>",
    } as const;

    typescript.manipulate(
      {
        type: "script",
        openTag: '<script lang="ts">',
        body: 'console.log("hello");',
        closeTag: "</script>",
      },
      (node) => {
        return node;
      },
    );
    expect(vueBlock.body).toBe('console.log("hello");');
  });
  test("typescript", async () => {
    const vueBlock = {
      type: "script",
      openTag: '<script lang="ts">',
      body: "const foo = (str: string) => str;",
      closeTag: "</script>",
    } as const;

    typescript.manipulate(vueBlock, (node) => {
      if (node.type === "Identifier" && node.name === "foo") {
        node.name = "bar";
      }
      return node;
    });
    expect(vueBlock.body).toBe("const bar = (str: string) => str;");
  });
});
