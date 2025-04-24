import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRouter, imageRouter, rootRouter, statusRouter } from './routes'


const app = new Hono()

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello from echo!')
})

app.route('/', rootRouter)
app.route('/auth', authRouter)
app.route('/image', imageRouter)
app.route('/status', statusRouter)

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
}
