import postcss, {
  Node,
  AtRule,
  Rule,
  Declaration,
  Comment,
  ChildNode,
} from "postcss";
import * as postcssScss from "postcss-scss";
import { VueBlock } from "../parse.js";

type InferNode<T> = T extends "atrule"
  ? AtRule
  : T extends "rule"
  ? Rule
  : T extends "decl"
  ? Declaration
  : T extends "comment"
  ? Comment
  : never;

export const cssNodeIs = <T extends "atrule" | "rule" | "decl" | "comment">(
  type: T,
  node: Node,
): node is InferNode<T> => {
  return node.type === type;
};

const throwIfNotStyle = (block: VueBlock) => {
  if (!block.openTag.startsWith("<style")) {
    throw new Error("Only <style> block is supported.");
  }
};

const _walk = (
  block: VueBlock,
  fn: (node: ChildNode) => void,
): postcss.LazyResult<postcss.Root> => {
  throwIfNotStyle(block);

  const style = block.body;

  const syntax = postcssScss;

  const ast = postcss().process(style, {
    syntax,
    from: "",
  });

  ast.root.walk((node) => {
    fn(node);
  });

  return ast;
};

export const walk = (block: VueBlock, fn: (node: ChildNode) => void) => {
  _walk(block, fn);
};

export const manipulate = (
  block: VueBlock,
  fn: (node: ChildNode) => void,
): void => {
  const ast = _walk(block, fn);
  block.body = ast.root.toString();
};
