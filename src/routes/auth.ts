import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { bearerAuth } from 'hono/bearer-auth'
import { getDefaultResponseBody } from './../utils'

const authRouter = new Hono()

authRouter.use(
  '/basic/:user/:password',
  basicAuth({
    verifyUser: (username, password, c) => {
      return (
        username === c.req.param('user') && password === c.req.param('password')
      )
    },
  })
)

authRouter.use(
  '/hidden-basic/:user/:password',
  basicAuth({
    verifyUser: (username, password, c) => {
      return (
        username === c.req.param('user') && password === c.req.param('password')
      )
    },
  })
)

authRouter.all('/basic/:user/:password', (c) => {
  return getDefaultResponseBody(c, 'Authenticated')
})

authRouter.all('/hidden-basic/:user/:password', (c) => {
  return getDefaultResponseBody(c, 'Authenticated')
})

authRouter.use(
  '/bearer',
  bearerAuth({
    verifyToken: (token, c) => {
      return token === (c.req.header('authorization')?.split(',')[0] || null)
    },
  })
)

authRouter.all('/bearer', (c) => {
  return getDefaultResponseBody(c, 'Authenticated')
})

authRouter.get('/digest/:qop/:username/:password', (c) => {
  const auth = c.req.header('authorization')
  if (!auth) {
    return getDefaultResponseBody(c, 'Unauthorized', 401)
  }
  if (!['auth','auth-int'].includes(c.req.param('qop'))) {
    return getDefaultResponseBody(c, 'Unauthorized', 401)
  }
  const [type, credentials] = auth.split(' ')
  if (type !== 'Digest') {
    return getDefaultResponseBody(c, 'Unauthorized', 401)
  }
  const [username, password] = Buffer.from(credentials, 'base64').toString().split(':')
  if (username !== c.req.param('username') || password !== c.req.param('password')) {
    return getDefaultResponseBody(c, 'Unauthorized', 401)
  }
  return getDefaultResponseBody(c, `Authenticated with qop: ${c.req.param('qop')}`, 200)
})

authRouter.get('/digest/:qop/:username/:password/:algorithm', (c) => {
  const auth = c.req.header('authorization')
  if (!auth) {
    return getDefaultResponseBody(c, 'Unauthorized', 401)
  }
  const allowedQops = ['auth', 'auth-int']
  if (!allowedQops.includes(c.req.param('qop'))) {
    return getDefaultResponseBody(c, `Wrong qop, possible values: ${allowedQops.join(', ')}`, 401)
  }
  const algorithm = c.req.param('algorithm').toLowerCase()
  const allowedAlgorithms = ['md5', 'sha-256', 'sha-512']
  if (!allowedAlgorithms.includes(algorithm)) {
    return getDefaultResponseBody(c, `Wrong algorithm, possible values: ${allowedAlgorithms.join(', ')}`, 401)
  }
  const [type, credentials] = auth.split(' ')
  if (type !== 'Digest') {
    return getDefaultResponseBody(c, 'Unauthorized', 401)
  }
  const [username, password] = Buffer.from(credentials, 'base64').toString().split(':')
  if (username !== c.req.param('username') || password !== c.req.param('password')) {
    return getDefaultResponseBody(c, 'Unauthorized', 401)
  }
  return getDefaultResponseBody(c, `Authenticated with algorithm: ${algorithm}`, 200)
})

export { authRouter }
