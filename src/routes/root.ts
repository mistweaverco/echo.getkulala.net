import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { getConnInfo } from "hono/bun";
import { getDefaultResponseBody } from "./../utils";

const rootRouter = new OpenAPIHono();

const postRoute = createRoute({
  method: "post",
  path: "/post",
  request: {
    body: {
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
      description: "post various data to the server",
      required: false,
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: {},
        },
        "text/html": {
          schema: {},
        },
        "text/plain": {
          schema: {},
        },
      },
      description: "200 OK",
    },
  },
});

rootRouter.openapi(postRoute, async (c) => {
  return await getDefaultResponseBody(c);
});

rootRouter.get("/get", (c) => {
  return getDefaultResponseBody(c);
});

rootRouter.put("/put", (c) => {
  return getDefaultResponseBody(c);
});

rootRouter.delete("/delete", (c) => {
  return getDefaultResponseBody(c);
});

rootRouter.patch("/patch", (c) => {
  return getDefaultResponseBody(c);
});

rootRouter.all("/headers", (c) => {
  return c.json(c.req.header());
});

rootRouter.all("/user-agent", (c) => {
  return c.json({ "user-agent": c.req.header("user-agent") });
});

rootRouter.all("/ip", (c) => {
  return c.json({ origin: getConnInfo(c).remote.address });
});

export { rootRouter };
