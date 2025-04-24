import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { createMiddleware } from 'hono/factory'

const imageRouter = new Hono()

const imageRootMiddleware = createMiddleware(async (c, next) => {
  const type = c.req.header('accept')
  switch (type) {
    case 'image/webp':
      c.req.path = 'webp.webp'
    case 'image/svg+xml':
      c.req.path = 'svg.svg'
    case 'image/png':
      c.req.path = 'png.png'
    case 'image/jpeg':
      c.req.path = 'jpeg.jpeg'
    case 'image/*':
    default:
      c.req.path = 'svg.svg'
  }
  await next()
})

imageRouter.get('/', imageRootMiddleware, serveStatic({
  root: './static/images',
}))

imageRouter.get(
  '/*',
  serveStatic({
    root: './static/images',
    rewriteRequestPath: (path) => {
      const newPath = path.replace('/image/', '')
      return newPath + '.' + newPath
    }
  })
)

export { imageRouter }
