import { marked } from "marked";

marked.setOptions({
  async: false,
  breaks: false,
  extensions: null,
  gfm: true,
  hooks: null,
  pedantic: false,
  silent: false,
  tokenizer: null,
  walkTokens: null,
});

export const parseMarkdown = (content: string): Promise<string> =>
  Promise.resolve(marked.parse(content));
