// User data caching utility
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class UserCache {
  private static getCacheKey(userId: string, dataType: string): string {
    return `user_${userId}_${dataType}`;
  }

  static set<T>(userId: string, dataType: string, data: T): void {
    const cacheKey = this.getCacheKey(userId, dataType);
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  static get<T>(userId: string, dataType: string): T | null {
    const cacheKey = this.getCacheKey(userId, dataType);
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const age = Date.now() - cacheItem.timestamp;

      if (age < CACHE_DURATION) {
        return cacheItem.data;
      } else {
        // Cache expired, remove it
        this.remove(userId, dataType);
        return null;
      }
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  static remove(userId: string, dataType: string): void {
    const cacheKey = this.getCacheKey(userId, dataType);
    try {
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Error removing cache:', error);
    }
  }

  static clearAll(userId: string): void {
    const keys = Object.keys(localStorage);
    const prefix = `user_${userId}_`;
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}
