import type { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

/**
 * @server-only
 * 
 * @description
 * Service for managing interactions with a Redis client.
 * 
 * This service ensures that the Redis client is connected before performing any operations.
 */
export class RedisService {
  private client: RedisClient;

  /**
   * Creates a new instance of RedisService.
   * @param client - An instance of a Redis client.
   */
  constructor(client: RedisClient) {
    this.client = client;
  }

  /**
   * Establishes a connection to the Redis client if it is not already connected.
   * @private
   */
  private async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  /**
   * Retrieves the value for the given key from Redis.
   * @param key - The key to retrieve.
   * @returns The value as a string or null if not found.
   */
  public async get(key: string): Promise<string | null> {
    await this.connect();
    return this.client.get(key);
  }

  /**
   * Sets the given key to the provided value in Redis.
   * @param key - The key to set.
   * @param value - The value to store.
   */
  public async set(key: string, value: string): Promise<void> {
    await this.connect();
    await this.client.set(key, value);
  }

  /**
   * Removes the given key from Redis.
   * @param key - The key to remove.
   * @returns The number of keys that were removed.
   */
  public async remove(key: string): Promise<number> {
    await this.connect();
    return this.client.del(key);
  }
}
