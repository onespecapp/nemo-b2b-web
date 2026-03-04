import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForm } from '../useForm'

describe('useForm', () => {
  const initial = { name: 'Alice', email: 'alice@example.com' }

  it('initializes with the given values', () => {
    const { result } = renderHook(() => useForm(initial))
    expect(result.current.values).toEqual(initial)
  })

  it('starts as not dirty', () => {
    const { result } = renderHook(() => useForm(initial))
    expect(result.current.isDirty).toBe(false)
  })

  it('updates a field via direct name/value', () => {
    const { result } = renderHook(() => useForm(initial))

    act(() => {
      result.current.handleChange('name', 'Bob')
    })

    expect(result.current.values.name).toBe('Bob')
    expect(result.current.isDirty).toBe(true)
  })

  it('updates a field via synthetic event', () => {
    const { result } = renderHook(() => useForm(initial))

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'bob@example.com', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.values.email).toBe('bob@example.com')
    expect(result.current.isDirty).toBe(true)
  })

  it('resets to initial values', () => {
    const { result } = renderHook(() => useForm(initial))

    act(() => {
      result.current.handleChange('name', 'Bob')
    })
    expect(result.current.isDirty).toBe(true)

    act(() => {
      result.current.reset()
    })

    expect(result.current.values).toEqual(initial)
    expect(result.current.isDirty).toBe(false)
  })

  it('resets to new values when provided', () => {
    const { result } = renderHook(() => useForm(initial))
    const newValues = { name: 'Charlie', email: 'charlie@example.com' }

    act(() => {
      result.current.reset(newValues)
    })

    expect(result.current.values).toEqual(newValues)
    expect(result.current.isDirty).toBe(false)
  })

  it('allows direct setValues', () => {
    const { result } = renderHook(() => useForm(initial))

    act(() => {
      result.current.setValues({ name: 'Direct', email: 'direct@test.com' })
    })

    expect(result.current.values.name).toBe('Direct')
    expect(result.current.isDirty).toBe(true)
  })
})
