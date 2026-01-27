/**
 * Rate Limiter Utility
 * Prevents API abuse by limiting requests per user within a time window
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
  message?: string;
}

class RateLimiter {
  private storage: Map<string, RateLimitRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired records every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Peek at current rate limit status WITHOUT consuming a request
   * @param key - Unique identifier (e.g., userId + endpoint)
   * @param config - Rate limit configuration
   * @returns Object with remaining requests and reset time
   */
  peek(key: string, config: RateLimitConfig): {
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const record = this.storage.get(key);

    // No record or expired
    if (!record || now >= record.resetTime) {
      return {
        remaining: config.maxRequests,
        resetTime: 0,
      };
    }

    return {
      remaining: Math.max(0, config.maxRequests - record.count),
      resetTime: record.resetTime,
    };
  }

  /**
   * Check if a request should be allowed and consume a request if allowed
   * @param key - Unique identifier (e.g., userId + endpoint)
   * @param config - Rate limit configuration
   * @returns Object with allowed status and remaining requests
   */
  check(key: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    message?: string;
  } {
    const now = Date.now();
    const record = this.storage.get(key);

    // No existing record or expired - allow and create new record
    if (!record || now >= record.resetTime) {
      this.storage.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
      };
    }

    // Record exists and not expired
    if (record.count < config.maxRequests) {
      // Increment count
      record.count++;
      this.storage.set(key, record);

      return {
        allowed: true,
        remaining: config.maxRequests - record.count,
        resetTime: record.resetTime,
      };
    }

    // Rate limit exceeded
    const resetInSeconds = Math.ceil((record.resetTime - now) / 1000);
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      message: config.message || `Rate limit exceeded. Try again in ${resetInSeconds} second${resetInSeconds !== 1 ? 's' : ''}.`,
    };
  }

  /**
   * Clean up expired records to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.storage.entries()) {
      if (now >= record.resetTime) {
        this.storage.delete(key);
      }
    }
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.storage.delete(key);
  }

  /**
   * Clear all rate limit records
   */
  clearAll(): void {
    this.storage.clear();
  }

  /**
   * Destroy the rate limiter and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.storage.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // Job Search API - 5 API calls per 30 minutes for all users (cached results don't count)
  JOB_SEARCH_FREE: {
    maxRequests: 5,
    windowMs: 30 * 60 * 1000, // 30 minutes
    message: 'Job search limit reached. Please try again later.',
  },
  JOB_SEARCH_PRO: {
    maxRequests: 10,
    windowMs: 30 * 60 * 1000, // 30 minutes
    message: 'Job search limit reached. Please try again later.',
  },

  // Document Generation - 1 per minute for each type (separate limits)
  DOCUMENT_GENERATION_RESUME: {
    maxRequests: 1,
    windowMs: 60 * 1000, // 1 minute
    message: 'Resume generation limit reached. Please wait 1 minute.',
  },
  DOCUMENT_GENERATION_COVER_LETTER: {
    maxRequests: 1,
    windowMs: 60 * 1000, // 1 minute
    message: 'Cover letter generation limit reached. Please wait 1 minute.',
  },

  // Job Automation - 3 automation runs per day for pro users
  JOB_AUTOMATION_PRO: {
    maxRequests: 3,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    message: 'Daily automation limit reached. Try again tomorrow.',
  },

  // Save Operations - 10 second cooldown to prevent database abuse
  SAVE_APPLICATIONS: {
    maxRequests: 1,
    windowMs: 10 * 1000, // 10 seconds
    message: 'Please wait 10 seconds before saving again.',
  },
  SAVE_PROFILE: {
    maxRequests: 1,
    windowMs: 10 * 1000, // 10 seconds
    message: 'Please wait 10 seconds before saving again.',
  },

  // Status Change - 3 second cooldown
  STATUS_CHANGE: {
    maxRequests: 1,
    windowMs: 3 * 1000, // 3 seconds
    message: 'Please wait 3 seconds before changing status again.',
  },
};

/**
 * Get rate limit key for a user and endpoint
 */
export function getRateLimitKey(userId: string, endpoint: string): string {
  return `${userId}:${endpoint}`;
}

/**
 * Peek at rate limit status without consuming a request
 * Use this for UI display purposes
 */
export function peekRateLimit(key: string, config: RateLimitConfig): {
  remaining: number;
  resetTime: number;
} {
  return rateLimiter.peek(key, config);
}

/**
 * Check rate limit and consume a request if allowed
 * Use this when actually making an API call
 */
export function checkRateLimit(key: string, config: RateLimitConfig): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  message?: string;
} {
  return rateLimiter.check(key, config);
}
