import { EditorState } from 'prosemirror-state';
import { isMarkActive, isNodeActive } from '@tiptap/core';

export const isInCode = (state: EditorState): boolean => {
  return isNodeActive(state, 'codeBlock') || isMarkActive(state, 'code');
};

export const isMarkdown = (text: string): boolean => {
  // code-ish
  const fences = text.match(/^```/gm);
  if (fences && fences.length > 1) return true;

  // link-ish
  if (text.match(/\[[^]+]\(https?:\/\/\S+\)/gm)) return true;
  if (text.match(/\[[^]+]\(\/\S+\)/gm)) return true;

  // heading-ish
  if (text.match(/^#{1,6}\s+\S+/gm)) return true;

  // list-ish
  const listItems = text.match(/^[\d-*].?\s\S+/gm);
  if (listItems && listItems.length > 1) return true;

  // blockquote-ish
  if (text.match(/^>\s+\S+/gm)) return true;

  // hr-ish
  if (text.match(/^---/gm)) return true;

  // image-ish
  if (text.match(/^!\[[^]+]\(https?:\/\/\S+\)/gm)) return true;

  // table-ish
  if (text.match(/^\|.*\|$/gm)) return true;

  // strong-ish
  if (text.match(/\*\*[^]+?\*\*/gm)) return true;

  // em-ish
  if (text.match(/_[^]+?_/gm)) return true;

  // strikethrough-ish
  if (text.match(/~~[^]+?~~/gm)) return true;

  // inline code-ish
  if (text.match(/`[^]+?`/gm)) return true;

  return false;
};