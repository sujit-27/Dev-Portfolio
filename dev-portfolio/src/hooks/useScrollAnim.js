import { useEffect, useRef, useState } from 'react'

/**
 * Returns [ref, isVisible].
 * Attach ref to any element; isVisible flips true once it enters the viewport.
 * @param {number} threshold  0–1, default 0.15
 * @param {string} rootMargin CSS margin, default '0px'
 */
export default function useScrollAnim(threshold = 0.15, rootMargin = '0px') {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect() } },
      { threshold, rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin])

  return [ref, isVisible]
}