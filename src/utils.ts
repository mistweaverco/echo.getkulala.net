import { Context } from 'hono'
import { ContentfulStatusCode } from 'hono/utils/http-status'

export const getDefaultResponseBody = (c: Context, fixedBody: string | undefined = undefined, fixedStatusCode: ContentfulStatusCode = 200) => {
  const contentType = c.req.header('content-type')
  let body = null
  let headers: string | Record<string, string> = {}
  switch (contentType) {
    case 'multipart/form-data':
    case 'application/x-www-form-urlencoded':
      body = fixedBody !== undefined ? fixedBody : c.req.parseBody()
      break
    case 'text/plain':
      body = fixedBody !== undefined ? fixedBody : c.req.text()
      break
    case 'application/json':
      body = fixedBody !== undefined ? fixedBody : c.req.json()
      break
    default:
      body = fixedBody !== undefined ? fixedBody : c.req.text()
      break
  }
  const data = {
    method: c.req.method,
    headers: c.req.header(),
    body,
  }
  switch (c.req.header('accept')) {
    case 'text/plain':
      headers = '';
      Object.entries(data.headers).forEach(([key, value]) => {
         headers += `${key}: ${value}\n`;
       });
      return c.text(`method:\n${data.method}\n\nheaders:\n${headers}\n\nbody:\n${body}`, fixedStatusCode);
    case 'text/html':
      headers = '';
      Object.entries(data.headers).forEach(([key, value]) => {
         headers += `<li>${key}: ${value}</li>\n`;
       });
      return c.html(`<html>
<head>
<title>echo</title>
</head>
<body>
<h1>echo</h1>
<p data-type="method">${data.method}</p>
<ul data-type="headers">
${headers}
</ul>
<p data-type="body">
${body}
</p>
</body>
</html>`, fixedStatusCode);
    case 'application/json':
    default:
      return c.json(data, fixedStatusCode);
  }
};
