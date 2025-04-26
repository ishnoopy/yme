import { createClient, RedisClientType } from "redis";
import { GeneralConfig } from "../config/general.js";

class RedisClient {
  private client: RedisClientType;
  private static instance: RedisClient;

  constructor() {
    // Use the Docker service name 'redis' when running in Docker
    const host = process.env.NODE_ENV === "production" ? "redis" : "localhost";
    this.client = createClient({
      url: `redis://${host}:${GeneralConfig.redisPort}`
    });
    this.client.on("error", (err) => console.log("Redis Client Error: ", err));
  }

  static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
      RedisClient.instance.client.connect();
    }

    return RedisClient.instance;
  }

  private async connectClient() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  public async get(key: string) {
    await this.connectClient();
    return this.client.get(key);
  }

  public async set(key: string, value: string) {
    await this.connectClient();
    return this.client.set(key, value);
  }

  public async del(key: string) {
    await this.connectClient();
    return this.client.del(key);
  }

  public async disconnect() {
    if (this.client.isOpen) {
      await this.client.disconnect();
    }
  }
}

export default RedisClient;