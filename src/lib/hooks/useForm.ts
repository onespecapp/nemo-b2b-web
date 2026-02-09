'use client'

import { useState, useCallback, useRef } from 'react'

type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const initialRef = useRef(initialValues)

  const handleChange = useCallback(
    (nameOrEvent: keyof T | ChangeEvent, directValue?: any) => {
      if (
        typeof nameOrEvent === 'object' &&
        nameOrEvent !== null &&
        'target' in nameOrEvent
      ) {
        const { name, value, type } = nameOrEvent.target as HTMLInputElement
        const parsed =
          type === 'number' || type === 'select-one'
            ? isNaN(Number(value))
              ? value
              : value
            : value
        setValues((prev) => ({ ...prev, [name]: parsed }))
      } else {
        setValues((prev) => ({ ...prev, [nameOrEvent]: directValue }))
      }
    },
    [],
  )

  const reset = useCallback(
    (newValues?: T) => {
      if (newValues !== undefined) {
        initialRef.current = newValues
        setValues(newValues)
      } else {
        setValues(initialRef.current)
      }
    },
    [],
  )

  const isDirty = (() => {
    const current = values
    const initial = initialRef.current
    for (const key in initial) {
      if (current[key] !== initial[key]) return true
    }
    return false
  })()

  return { values, setValues, handleChange, reset, isDirty }
}
