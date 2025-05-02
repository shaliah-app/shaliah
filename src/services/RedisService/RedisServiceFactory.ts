import { createClient } from "redis";
import { RedisService } from "./RedisService.server";
import { $ } from "@builder.io/qwik";
import { type NoSerialize, noSerialize, type QRL } from "@qwik.dev/core";

export type ServerRedisService = NoSerialize<RedisService>;

export const createRedisService: QRL<() => ServerRedisService> = $(
  () => {
    const host = process.env.REDIS_HOST || "localhost";
    const port = Number(process.env.REDIS_PORT) || 6379;

    const client = createClient({
      socket: { host, port },
    });

    client.on("error", (err) => console.error("Redis Client Error", err));

    return noSerialize(new RedisService(client));
  }
);
