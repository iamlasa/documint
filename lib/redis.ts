import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const CACHE_TTL = 60 * 5 // 5 minutes

export async function getCachedData(key: string) {
  return redis.get(key)
}

export async function setCachedData(key: string, data: any) {
  return redis.set(key, data, { ex: CACHE_TTL })
}

export async function invalidateCache(key: string) {
  return redis.del(key)
}