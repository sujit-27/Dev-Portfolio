import { useEffect, useState } from 'react'

/**
 * Cycles through `words` with a typewriter + erase effect.
 * Returns { display, wordIndex } where display is the current visible string.
 */
export default function useTypewriter(words = [], typeSpeed = 80, eraseSpeed = 40, pauseMs = 1800) {
  const [display, setDisplay]     = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [phase, setPhase]         = useState('typing') // 'typing' | 'pausing' | 'erasing'

  useEffect(() => {
    if (!words.length) return
    const word = words[wordIndex % words.length]
    let timer

    if (phase === 'typing') {
      if (display.length < word.length) {
        timer = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), typeSpeed)
      } else {
        timer = setTimeout(() => setPhase('pausing'), pauseMs)
      }
    } else if (phase === 'pausing') {
      setPhase('erasing')
    } else if (phase === 'erasing') {
      if (display.length > 0) {
        timer = setTimeout(() => setDisplay(display.slice(0, -1)), eraseSpeed)
      } else {
        setWordIndex(i => i + 1)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timer)
  }, [display, phase, wordIndex, words, typeSpeed, eraseSpeed, pauseMs])

  return { display, wordIndex: wordIndex % words.length }
}