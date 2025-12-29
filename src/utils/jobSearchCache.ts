// Client-side cache for job search results
// Caches based on search parameters to minimize API calls

interface CacheEntry {
  data: any[];
  timestamp: number;
  params: string; // JSON stringified search params
}

const CACHE_KEY = 'job_search_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export class JobSearchCache {
  /**
   * Generate cache key from search parameters
   */
  private static getCacheKey(params: any): string {
    // Create a normalized key from search params
    const normalized = {
      country: params.country || 'us',
      title: (params.title || '').toLowerCase().trim(),
      location: (params.location || '').toLowerCase().trim(),
      limit: params.limit || 20,
      datePosted: params.datePosted || '7'
    };
    return JSON.stringify(normalized);
  }

  /**
   * Get cached results if they exist and are fresh
   */
  static get(params: any): any[] | null {
    try {
      const cacheKey = this.getCacheKey(params);
      const cached = localStorage.getItem(CACHE_KEY);
      
      if (!cached) return null;

      const entries: CacheEntry[] = JSON.parse(cached);
      const entry = entries.find(e => e.params === cacheKey);

      if (!entry) return null;

      // Check if cache is still fresh
      const age = Date.now() - entry.timestamp;
      if (age > CACHE_DURATION) {
        // Cache expired, remove it
        this.remove(params);
        return null;
      }

      console.log(`Using cached job search results (${Math.floor(age / 1000 / 60)} minutes old)`);
      return entry.data;
    } catch (error) {
      console.error('Error reading job search cache:', error);
      return null;
    }
  }

  /**
   * Save search results to cache
   */
  static set(params: any, data: any[]): void {
    try {
      const cacheKey = this.getCacheKey(params);
      const cached = localStorage.getItem(CACHE_KEY);
      
      let entries: CacheEntry[] = cached ? JSON.parse(cached) : [];
      
      // Remove old entry for these params if it exists
      entries = entries.filter(e => e.params !== cacheKey);
      
      // Add new entry
      entries.push({
        data,
        timestamp: Date.now(),
        params: cacheKey
      });

      // Keep only last 10 searches to avoid bloating localStorage
      if (entries.length > 10) {
        entries = entries.slice(-10);
      }

      localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
      console.log('Job search results cached');
    } catch (error) {
      console.error('Error saving job search cache:', error);
    }
  }

  /**
   * Remove specific cache entry
   */
  static remove(params: any): void {
    try {
      const cacheKey = this.getCacheKey(params);
      const cached = localStorage.getItem(CACHE_KEY);
      
      if (!cached) return;

      let entries: CacheEntry[] = JSON.parse(cached);
      entries = entries.filter(e => e.params !== cacheKey);
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error removing job search cache:', error);
    }
  }

  /**
   * Clear all cached job searches
   */
  static clear(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
      console.log('Job search cache cleared');
    } catch (error) {
      console.error('Error clearing job search cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static getStats(): { totalEntries: number; oldestAge: number; newestAge: number } | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const entries: CacheEntry[] = JSON.parse(cached);
      if (entries.length === 0) return null;

      const now = Date.now();
      const ages = entries.map(e => now - e.timestamp);

      return {
        totalEntries: entries.length,
        oldestAge: Math.max(...ages),
        newestAge: Math.min(...ages)
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return null;
    }
  }
}
