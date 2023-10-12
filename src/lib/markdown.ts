import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeShikiji from 'rehype-shikiji';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShikiji, {
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  })
  .use(rehypeSanitize, {
    attributes: {
      pre: ['class', 'style'],
      div: ['class', 'style'],
      span: ['class', 'style'],
    },
  })
  .use(rehypeStringify);

export const render = async (markdown: string) => {
  const file = await processor.process(markdown);
  return file.toString();
};
