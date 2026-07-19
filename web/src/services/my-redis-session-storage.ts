// my-redis-session-storage.ts
import { Inject, Injectable } from '@nestjs/common';
import { SessionStorage } from '@nestjs-shopify/core';
import { Session } from '@shopify/shopify-api';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MyRedisSessionStorage implements SessionStorage {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async storeSession(session: Session): Promise<boolean> {
    await this.cacheManager.set(`session:${session.id}`, session);

    // Store session to a shop depending on the type of session e.g POS, Admin, Mobile
    const previousShopSession: string | null =
      (await this.cacheManager.get(`shop_sessions:${session.shop}`)) ?? null;
    console.log(previousShopSession);
    if (previousShopSession) {
      const values: string[] = JSON.parse(previousShopSession) as string[];
      await this.cacheManager.set(`shop_sessions:${session.shop}`, [
        ...values,
        session.id,
      ]);
    }

    return true;
  }

  async loadSession(id: string): Promise<Session | undefined> {
    return this.cacheManager.get(id);
  }

  async deleteSession(id: string): Promise<boolean> {
    // ... implement your redis delete logic
    return this.cacheManager.del(id);
  }

  async deleteSessions(ids: string[]): Promise<boolean> {
    // ... implement your redis multi-delete logic
    return new Promise((resolve, reject) => {
      try {
        ids.forEach((item) => this.cacheManager.del(item));
        resolve(true);
      } catch (e) {
        reject(new Error('false'));
      }
    });
  }

  async findSessionsByShop(shop: string): Promise<Session[]> {
    // ... implement your redis multi-find logic
    return Promise.resolve([]);
  }
}
