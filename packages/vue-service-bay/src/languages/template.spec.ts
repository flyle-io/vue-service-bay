import { describe, test, expect } from "vitest";
import * as html from "./template.js";

describe("html", () => {
  test("basic", async () => {
    const vueBlock = {
      type: "template",
      openTag: "<template>",
      body: '<div v-else>hello</div><FuiIcon /><FuiIcon iconName="trash" /><FuiBox isHidden />',
      closeTag: "</template>",
    } as const;

    html.manipulate(vueBlock, (node) => {
      if (node.type === "tag" && node.name === "div") {
        node.name = "span";
        node.attribs = { ...node.attribs, class: "foo" };
      }
      if (node.type === "text") {
        node.data = node.data.toUpperCase();
      }
    });
    expect(vueBlock.body).toBe(
      '<span v-else class="foo">HELLO</span><FuiIcon/><FuiIcon iconName="trash"/><FuiBox isHidden/>',
    );
  });
});
