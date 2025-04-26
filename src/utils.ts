import { Context } from "hono";
import { createRoute, type RouteConfig } from "@hono/zod-openapi";
import { ContentfulStatusCode } from "hono/utils/http-status";

interface GetDefaultRouteParams {
  tags: RouteConfig["tags"];
  summary: RouteConfig["summary"];
  method: RouteConfig["method"];
  path: RouteConfig["path"];
  parameters?: RouteConfig["parameters"];
  security?: RouteConfig["security"];
  requestDescription: string;
  responseDescription: string;
  customResponses?: RouteConfig["responses"];
}

export const getDefaultRoute = (opts: GetDefaultRouteParams) => {
  const defaultResponses: RouteConfig["responses"] = {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              method: {
                type: "string",
              },
              headers: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              body: {
                type: "object",
              },
            },
          },
        },
        "text/html": {
          schema: {
            type: "string",
            example: `<html>
<head>
<title>echo</title>
</head>
<body>
<h1>echo</h1>
<p data-type="method">GET</p>
<ul data-type="headers">
<li>header1: value1</li>
<li>header2: value2</li>
</ul>
<p data-type="body">
{"key1":"value1","key2":"value2"}</p>
</body>
</html>`,
          },
        },
        "text/plain": {
          schema: {
            type: "string",
            example: `method:
GET
headers:
header1: value1
header2: value2
body:
{"key1":"value1","key2":"value2"}`,
          },
        },
      },
    },
  };
  if (opts.customResponses) {
    Object.entries(opts.customResponses).forEach(([key, value]) => {
      defaultResponses[key] = value;
    });
  }
  return createRoute({
    tags: opts.tags,
    summary: opts.summary,
    method: opts.method,
    path: opts.path,
    parameters: opts.parameters,
    security: opts.security,
    request: {
      body:
        opts.method === "get"
          ? undefined
          : {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                  },
                },
                "text/plain": {
                  schema: {
                    type: "string",
                    default: "hello echo",
                  },
                },
                "multipart/form-data": {
                  schema: {
                    type: "object",
                    default: {
                      key1: "value1",
                      key2: "value2",
                    },
                  },
                },
                "application/x-www-form-urlencoded": {
                  schema: {
                    type: "object",
                    default: {
                      key1: "value1",
                      key2: "value2",
                    },
                  },
                },
              },
              description: opts.requestDescription,
              required: false,
            },
    },
    responses: defaultResponses,
  });
};

export const getDefaultResponseBody = async (
  c: Context,
  fixedBody: string | undefined = undefined,
  fixedStatusCode: ContentfulStatusCode = 200,
) => {
  const contentType = c.req.header("content-type");
  let body = null;
  let headers: string | Record<string, string> = {};
  switch (contentType) {
    case "multipart/form-data":
    case "application/x-www-form-urlencoded":
      body = fixedBody !== undefined ? fixedBody : await c.req.parseBody();
      break;
    case "text/plain":
      body = fixedBody !== undefined ? fixedBody : await c.req.text();
      break;
    case "application/json":
      body = fixedBody !== undefined ? fixedBody : await c.req.json();
      break;
    default:
      body = fixedBody !== undefined ? fixedBody : await c.req.text();
      break;
  }
  const data = {
    method: c.req.method,
    headers: c.req.header(),
    body,
  };
  switch (c.req.header("accept")) {
    case "text/plain":
      headers = "";
      Object.entries(data.headers).forEach(([key, value]) => {
        headers += `${key}: ${value}\n`;
      });
      return c.text(
        `method:\n${data.method}\n\nheaders:\n${headers}\n\nbody:\n${body}`,
        fixedStatusCode,
      );
    case "text/html":
      headers = "";
      Object.entries(data.headers).forEach(([key, value]) => {
        headers += `<li>${key}: ${value}</li>\n`;
      });
      return c.html(
        `<html>
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
</html>`,
        fixedStatusCode,
      );
    case "application/json":
    default:
      return c.json(data, fixedStatusCode);
  }
};
