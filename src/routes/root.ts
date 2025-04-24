import { Hono } from 'hono'
import { getConnInfo } from 'hono/bun'
import { getDefaultResponseBody } from './../utils'

const rootRouter = new Hono()

rootRouter.post('/post', (c) => {
  return getDefaultResponseBody(c)
})

rootRouter.get('/get', (c) => {
  return getDefaultResponseBody(c)
})

rootRouter.put('/put', (c) => {
  return getDefaultResponseBody(c)
})

rootRouter.delete('/delete', (c) => {
  return getDefaultResponseBody(c)
})

rootRouter.patch('/patch', (c) => {
  return getDefaultResponseBody(c)
})

rootRouter.all('/headers', (c) => {
  return c.json(c.req.header())
})

rootRouter.all('/user-agent', (c) => {
  return c.json({'user-agent': c.req.header('user-agent')})
})

rootRouter.all('/ip', (c) => {
  return c.json({'origin': getConnInfo(c).remote.address})
})

export { rootRouter }
