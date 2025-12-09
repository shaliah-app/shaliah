import { v4 as uuidv4 } from "uuid";
import type { Cookie } from "@qwik.dev/router";
import type { ServerRedisService } from "../RedisService";

/**
 * @server-only
 * 
 * @description
 * Service responsible for managing user sessions, including session creation, retrieval, and updates.
 *
 * This service relies on cookies to maintain session identity and uses Redis for session data persistence.
 *
 * @remarks
 * The session identifier is stored in a cookie with the name "session-id". A new session ID is generated
 * using a UUID and is stored with properties tailored for secure usage (e.g., HttpOnly, secure in production).
 * The service retrieves and updates session data by interacting with a Redis instance, where session data is stored
 * in JSON format under a key prefixed with "session:".
 *
 * @example
 * Creating a new session ID:
 * ```tsx
 * const sessionId = await SessionService.createSessionId(cookie);
 * ```
 *
 * Retrieving session data:
 * ```tsx
 * const data = await sessionService.getSession();
 * const specificValue = await sessionService.getSession("key");
 * ```
 *
 * Updating session data:
 * ```tsx
 * await sessionService.updateSession({ user: "John Doe" });
 * ```
 *
 * @public
 */
export class SessionService {
  static SESSION_COOKIE_NAME = "session-id";
  private redisService: ServerRedisService;
  private id: string;

  /**
   * Creates a new SessionService instance.
   * @param cookie - The cookie object to get/set session cookies.
   * @param redisService - The Redis service for session persistence.
   */
  constructor(cookie: Cookie, redisService: ServerRedisService) {
    this.redisService = redisService;

    this.id = cookie.get(SessionService.SESSION_COOKIE_NAME)!.value;
  }

  /**
   * Creates a new session ID, sets it in the provided cookie, and returns the session ID.
   * @param cookie - The cookie object used for storing the session ID.
   * @returns The generated session ID.
   */
  static async createSessionId(cookie: Cookie): Promise<string> {
    const sessionId = uuidv4();

    cookie.set(this.SESSION_COOKIE_NAME, sessionId, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "strict",
    });

    return sessionId;
  }

  /**
   * Retrieves the session data from Redis.
   * @param key - Optional key to extract a specific value from the session.
   * @returns The session data or a specific session entry if key is provided.
   */
  public async getSession(key?: string): Promise<Record<string, any>> {
    const sessionData =
      (await this.redisService?.get(`session:${this.id}`)) ?? "{}";

    const parsedData = JSON.parse(sessionData) as Record<string, any>;
    return key ? parsedData[key] : parsedData;
  }

  /**
   * Updates the session data in Redis.
   * @param data - An object containing the session data to update.
   * @returns A promise that resolves when the update is complete.
   */
  public async updateSession(data: Record<string, any>): Promise<void> {
    await this.redisService?.set(`session:${this.id}`, JSON.stringify(data));
  }
}
