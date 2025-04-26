import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { getConnInfo } from "hono/bun";
import { getDefaultResponseBody, getDefaultRoute } from "./../utils";

const rootRouter = new OpenAPIHono();

rootRouter.openapi(
  getDefaultRoute({
    path: "/post",
    method: "post",
    requestDescription: "post various data to the server",
    responseDescription: "200 OK",
  }),
  async (c) => {
    return await getDefaultResponseBody(c);
  },
);

rootRouter.openapi(
  getDefaultRoute({
    path: "/get",
    method: "get",
    requestDescription: "get various data from the server",
    responseDescription: "200 OK",
  }),
  (c) => {
    return getDefaultResponseBody(c);
  },
);

rootRouter.openapi(
  getDefaultRoute({
    path: "/put",
    method: "put",
    requestDescription: "put various data to the server",
    responseDescription: "200 OK",
  }),
  (c) => {
    return getDefaultResponseBody(c);
  },
);

rootRouter.openapi(
  getDefaultRoute({
    path: "/delete",
    method: "delete",
    requestDescription: "delete various data from the server",
    responseDescription: "200 OK",
  }),
  (c) => {
    return getDefaultResponseBody(c);
  },
);

rootRouter.openapi(
  getDefaultRoute({
    path: "/patch",
    method: "patch",
    requestDescription: "patch various data to the server",
    responseDescription: "200 OK",
  }),
  (c) => {
    return getDefaultResponseBody(c);
  },
);

rootRouter.get("/headers", (c) => {
  return c.json(c.req.header());
});

rootRouter.all("/user-agent", (c) => {
  return c.json({ "user-agent": c.req.header("user-agent") });
});

rootRouter.all("/ip", (c) => {
  return c.json({ origin: getConnInfo(c).remote.address });
});

export { rootRouter };
