import type { RequestHandler } from "@qwik.dev/router";
import { v4 as uuidv4 } from "uuid";

export const sessionMiddleware: RequestHandler = async ({ cookie, next }) => {
  const sessionId = cookie.get("session-id");

  if (!sessionId) {
    const id = uuidv4();

    cookie.set("session-id", id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "strict",
    });
  }

  return await next();
};
