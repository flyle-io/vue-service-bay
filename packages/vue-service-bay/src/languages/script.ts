import { parse, print } from "recast";
import * as tsParser from "recast/parsers/typescript.js";
import type { Node } from "@babel/types";
import { walk as zimmerframe } from "zimmerframe";
import { VueBlock } from "../parse.js";

const throwIfNotScript = (block: VueBlock) => {
  if (!block.openTag.startsWith("<script")) {
    throw new Error("Only <script> block is supported.");
  }
};

const _walk = (block: VueBlock, fn: (node: Node) => void): Node => {
  throwIfNotScript(block);

  const ast = parse(block.body, {
    parser: tsParser,
  }) as Node;
  zimmerframe(ast, null, {
    _(node, { state, next }) {
      fn(node);
      next(state);
    },
  });

  return ast;
};

export const walk = (block: VueBlock, fn: (node: Node) => void) => {
  _walk(block, fn);
};

export const manipulate = (block: VueBlock, fn: (node: Node) => void) => {
  const ast = _walk(block, fn);
  block.body = print(ast).code;
};
