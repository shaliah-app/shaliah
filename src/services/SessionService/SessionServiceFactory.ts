import type { NoSerialize, QRL } from "@qwik.dev/core";
import { noSerialize, $ } from "@qwik.dev/core";
import { createRedisService } from "../RedisService";
import { SessionService } from "./SessionService.server";
import type { Cookie } from "@qwik.dev/router";

export type ServerSessionService = NoSerialize<SessionService>;

export const createSessionService: QRL<
  (cookie: Cookie) => Promise<ServerSessionService>
> = $(async (cookie) => {
  const redis = await createRedisService();

  return noSerialize(new SessionService(cookie, redis));
});
