import { Hono } from 'hono'
import { ContentfulStatusCode } from 'hono/utils/http-status'

const statusRouter = new Hono()

statusRouter.all('/:codes', (c) => {
  const codes = c.req.param('codes').split(',');
  const code = codes[Math.floor(Math.random() * codes.length)];
  const status = parseInt(code, 10);

  if (isNaN(status)) {
    return c.json({ text: 'Invalid status code' }, 400);
  }
  if (status < 100 || status > 599) {
    return c.json({ text: 'Invalid status code' }, 400);
  }

  return c.json({ text: 'Hello from echo!' }, status as ContentfulStatusCode);
});

export { statusRouter }
