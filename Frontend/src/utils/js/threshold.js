export const createThreshold = (delay = 600) => {
  let blocked = false

  return (callback) => {
    if (blocked) return false

    blocked = true
    callback()
    window.setTimeout(() => {
      blocked = false
    }, delay)

    return true
  }

}

export const createLatestThreshold = (delay = 600) => {
  let timeoutId = null

  const threshold = (callback) => {
    if (timeoutId) window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      timeoutId = null
      callback()
    }, delay)
  }

  threshold.cancel = () => {
    if (timeoutId) window.clearTimeout(timeoutId)
    timeoutId = null
  }

  return threshold
}
