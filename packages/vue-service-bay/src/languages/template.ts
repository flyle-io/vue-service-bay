import * as htmlparser2 from "htmlparser2";
import render from "dom-serializer";
import { VueBlock } from "../parse.js";
import type { ChildNode } from "domhandler";

const traverse = (node: ChildNode, fn: (node: ChildNode) => void) => {
  if ("children" in node) {
    for (const child of node.children) {
      traverse(child, fn);
    }
  }
  fn(node);
};

const throwIfNotTemplate = (block: VueBlock) => {
  if (!block.openTag.startsWith("<template")) {
    throw new Error("Only <template> block is supported.");
  }
};

const _walk = (
  block: VueBlock,
  fn: (node: ChildNode) => void,
): htmlparser2.DomHandler => {
  throwIfNotTemplate(block);

  const html = block.body;
  const handler = new htmlparser2.DomHandler(
    (_, dom) => {
      for (const node of dom) {
        traverse(node, fn);
      }
    },
    {
      withStartIndices: true,
      withEndIndices: true,
      xmlMode: true,
    },
  );
  const parser = new htmlparser2.Parser(handler, {
    xmlMode: true,
    decodeEntities: false,
    lowerCaseTags: false,
    lowerCaseAttributeNames: false,
  });
  parser.parseComplete(html);

  return handler;
};

export const walk = (block: VueBlock, fn: (node: ChildNode) => void) => {
  _walk(block, fn);
};

export const manipulate = (block: VueBlock, fn: (node: ChildNode) => void) => {
  const handler = _walk(block, fn);

  let updated = render(handler.dom, {
    xmlMode: true,
    emptyAttrs: false,
    selfClosingTags: true,
    encodeEntities: false,
    decodeEntities: false,
  });

  // Hack: Attributes like <div else> are now <div else="">, so rewrite them as <div else>.
  let removedCharSize = 0;
  for (const match of Array.from(updated.matchAll(/\S+=(""|'')/gm))) {
    if (!match || match.index == null) continue;
    const text = match[0];
    updated =
      updated.substring(0, match.index + text.length - 3 - removedCharSize) +
      updated.substring(match.index + text.length - removedCharSize);
    removedCharSize += 3;
  }

  block.body = updated;
};
