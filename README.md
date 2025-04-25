# echo.getkulala.net

A httpbin.org clone using bun.sh and hono.dev.

## Usage

```bash
docker run -d \
  --name echo \
  --restart always \
  -e PORT=3002 \
  -p 3002:3002 \
  pull.docker.build/kulala/echo
```

Open http://localhost:3002/ in your browser.
