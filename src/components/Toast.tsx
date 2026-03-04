'use client'

import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning'

export interface ToastData {
  id: string
  message: string
  type: ToastType
}

const typeStyles: Record<ToastType, { bg: string; border: string; icon: string; progress: string }> = {
  success: {
    bg: 'bg-white',
    border: 'border-[#0f766e]/30',
    icon: 'text-[#0f766e]',
    progress: 'bg-[#0f766e]',
  },
  error: {
    bg: 'bg-white',
    border: 'border-[#ef4444]/30',
    icon: 'text-[#ef4444]',
    progress: 'bg-[#ef4444]',
  },
  warning: {
    bg: 'bg-white',
    border: 'border-[#f97316]/30',
    icon: 'text-[#f97316]',
    progress: 'bg-[#f97316]',
  },
}

function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'success') {
    return (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  }
  if (type === 'error') {
    return (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  }
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3l9.66 16.5H2.34L12 3z" />
    </svg>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const styles = typeStyles[toast.type]

  useEffect(() => {
    // Trigger enter animation on next frame
    const enterTimer = requestAnimationFrame(() => setVisible(true))

    const dismissTimer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => onDismiss(toast.id), 300)
    }, 4000)

    return () => {
      cancelAnimationFrame(enterTimer)
      clearTimeout(dismissTimer)
    }
  }, [toast.id, onDismiss])

  const handleClose = () => {
    setExiting(true)
    setTimeout(() => onDismiss(toast.id), 300)
  }

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border shadow-lg transition-all duration-300 ease-out ${styles.bg} ${styles.border} ${
        visible && !exiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
      style={{ fontFamily: 'Manrope, sans-serif' }}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <div className={`mt-0.5 ${styles.icon}`}>
          <ToastIcon type={toast.type} />
        </div>
        <p className="flex-1 text-sm font-medium text-[#0f1f1a]">{toast.message}</p>
        <button
          onClick={handleClose}
          className="shrink-0 rounded-lg p-1 text-[#0f1f1a]/40 transition hover:bg-[#0f1f1a]/5 hover:text-[#0f1f1a]/70"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="h-1 w-full bg-[#0f1f1a]/5">
        <div
          className={`h-full ${styles.progress} rounded-full`}
          style={{
            animation: visible && !exiting ? 'toast-progress 4s linear forwards' : 'none',
          }}
        />
      </div>
      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}

export default function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-end gap-3 p-4 sm:p-6">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
