import { useRef, useCallback, useEffect } from 'react'

const useDebouncedCallback = (callback, delay = 600) => {
  const timeoutRef = useRef(null)

  const debouncedFn = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay])

  // cleanup on unmount so no stale calls fire after the component's gone
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return debouncedFn
}

export default useDebouncedCallback