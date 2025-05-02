import type { RequestHandler } from "@qwik.dev/router";
import { SessionService } from "~/services/SessionService";

export const sessionMiddleware: RequestHandler = async ({ cookie, next }) => {
  const sessionId = cookie.get(SessionService.SESSION_COOKIE_NAME);

  if (!sessionId) SessionService.createSessionId(cookie);

  return await next();
};
