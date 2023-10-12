import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeShikiji from 'rehype-shikiji';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeShikiji, {
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  })
  .use(rehypeStringify);

export const render = async (markdown: string) => {
  const file = await processor.process(markdown);
  return file.toString();
};
