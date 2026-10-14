import { useCallback, useState } from 'react'

// Buffer for keypad input (PINs, codes). Pass 'del' to remove the last digit.
export function useDigits(max) {
  const [buf, setBuf] = useState('')
  const press = useCallback((k) => setBuf((x) => (k === 'del' ? x.slice(0, -1) : x.length < max ? x + k : x)), [max])
  return [buf, press, () => setBuf('')]
}
