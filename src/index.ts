import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { authRouter, imageRouter, rootRouter, statusRouter } from "./routes";

const app = new OpenAPIHono();

app.use("*", cors());

app.get(
  "/",
  swaggerUI({
    title: "echo",
    deepLinking: true,
    url: "/doc",
  }),
);
app.route("/", rootRouter);
app.route("/auth", authRouter);
app.route("/image", imageRouter);
app.route("/status", statusRouter);
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "echo",
  },
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
