import { useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T){
  const [state, setState] = useState<T>(() => {
    try{
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    }catch(e){
      return initial
    }
  })
  const set = (val: T) => {
    setState(val)
    localStorage.setItem(key, JSON.stringify(val))
  }
  return [state, set] as const
}
