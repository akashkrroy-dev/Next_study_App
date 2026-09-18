import { redisClient } from "./redis.js"

// * SINGLE SOURCE OF TRUTH FOR CACHE KEYS (versioned — bump `v1` on shape changes)
const V = "nx:v1"
export const KEYS = {
  gridData: (userId, ttId, month, year) => `${V}:grid:${userId}:${ttId}:${month}:${year}`,
  gridByTimetable: (userId, ttId) => `${V}:grid:${userId}:${ttId}:*`,
  target: (userId, ttId) => `${V}:target:${userId}:${ttId}`,
  totalDashbord: (userId, ttId) => `${V}:dash:total:${userId}:${ttId}`,
  todosDashbord: (userId) => `${V}:dash:todos:${userId}`,
  lastWeekDashbord: (userId, ttId) => `${V}:dash:lastweek:${userId}:${ttId}`,
  dashboard: (userId) => `${V}:dash:dashboard:${userId}`,
  timetable: (userId, ttId) => `${V}:timetable:${userId}:${ttId}`,
}

// * CACHE TTL — per-day data is authoritative once invalidated on writes; 1h keeps
// * stale-read risk low without hammering Mongo on every request.
export const CACHE_TTL_SEC = 60 * 60

const warn = (err) => console.warn("Redis unavailable, skipping cache operation:", err.message)

export const cacheGet = async (key) => {
  if (!redisClient?.isReady) return null
  try {
    return await redisClient.get(String(key))
  } catch (err) {
    warn(err)
    return null
  }
}

export const cacheSet = async (key, value, ttlSec = CACHE_TTL_SEC) => {
  if (!redisClient?.isReady) return null
  try {
    return await redisClient.set(
      String(key),
      typeof value === "string" ? value : String(value),
      { expiration: { type: "EX", value: ttlSec } }
    )
  } catch (err) {
    warn(err)
    return null
  }
}

export const cacheDel = async (key) => {
  if (!redisClient?.isReady) return null
  try {
    return await redisClient.del(String(key))
  } catch (err) {
    warn(err)
    return null
  }
}

export const cacheDelMany = async (keys) => {
  if (!redisClient?.isReady) return null
  try {
    const cleanKeys = (keys || []).filter(Boolean).map(String)
    return cleanKeys.length ? await redisClient.del(...cleanKeys) : null
  } catch (err) {
    warn(err)
    return null
  }
}

export const cacheDelPattern = async (pattern) => {
  if (!redisClient?.isReady) return null
  try {
    const keys = []
    for await (const key of redisClient.scanIterator({ MATCH: String(pattern), COUNT: 100 })) {
      keys.push(String(key))
    }
    return keys.length ? await redisClient.del(...keys) : null
  } catch (err) {
    warn(err)
    return null
  }
}

export const cacheDelTimetableSpace = async (userId, ttId) => {
  if (!redisClient?.isReady) return null
  await cacheDelPattern(KEYS.gridByTimetable(userId, ttId))
  return cacheDelMany([
    KEYS.target(userId, ttId),
    KEYS.totalDashbord(userId, ttId),
    KEYS.timetable(userId, ttId),
  ])
}