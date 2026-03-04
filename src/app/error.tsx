'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#ef4444]/20 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ef4444]/10">
          <svg className="h-6 w-6 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-[#0f1f1a]">Something went wrong</h2>
        <p className="mt-2 text-sm text-[#0f1f1a]/60">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-[#0f1f1a]/40">Error ID: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-[#0f1f1a] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0f1f1a]/90"
          >
            Try again
          </button>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-[#0f1f1a]/15 px-6 py-3 text-sm font-semibold text-[#0f1f1a]/70 transition hover:border-[#0f1f1a]/30"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
