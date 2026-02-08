'use client'

import { useEffect, useRef, useCallback, type ReactNode } from 'react'

interface AccessibleModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean
  /** Called when the modal should close (Escape key, backdrop click) */
  onClose: () => void
  /** Accessible label describing the modal purpose */
  ariaLabel: string
  /** Additional className for the inner modal panel (merged with defaults) */
  panelClassName?: string
  /** Override the default backdrop className */
  backdropClassName?: string
  /** Modal content */
  children: ReactNode
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/**
 * Accessible modal wrapper that provides:
 * - role="dialog" and aria-modal="true"
 * - aria-label for screen readers
 * - Escape key listener to close
 * - Focus trap (Tab / Shift+Tab cycle within modal)
 * - Auto-focus first focusable element on open
 * - Returns focus to trigger element on close
 *
 * Visual styling of the backdrop and panel is preserved from the existing
 * design. Only ARIA and keyboard behaviour are added.
 */
export default function AccessibleModal({
  isOpen,
  onClose,
  ariaLabel,
  panelClassName,
  backdropClassName,
  children,
}: AccessibleModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)

  // Capture the element that was focused when the modal opens so we can
  // return focus to it on close.
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement
    }
  }, [isOpen])

  // When modal closes, return focus to the trigger element.
  useEffect(() => {
    if (!isOpen && triggerRef.current && triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus()
      triggerRef.current = null
    }
  }, [isOpen])

  // Auto-focus the first focusable element inside the modal when it opens.
  useEffect(() => {
    if (!isOpen) return
    // Use a small timeout so that the modal DOM is rendered before we query.
    const id = setTimeout(() => {
      if (!panelRef.current) return
      const first = panelRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      if (first) {
        first.focus()
      } else {
        // If there are no focusable children, focus the panel itself.
        panelRef.current.focus()
      }
    }, 0)
    return () => clearTimeout(id)
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus trap: keep Tab / Shift+Tab cycling within the modal.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (!panelRef.current) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        // Shift+Tab: if focus is on the first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        // Tab: if focus is on the last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [],
  )

  // Prevent background scrolling while modal is open.
  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Backdrop
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={backdropClassName || "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"}
      onMouseDown={(e) => {
        // Close when clicking the backdrop (not the panel).
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Dialog panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={panelClassName}
      >
        {children}
      </div>
    </div>
  )
}
