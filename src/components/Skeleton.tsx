'use client'

/**
 * Skeleton loading components for content placeholders.
 * Replaces loading spinners with layout-matched pulse animations.
 */

/** Base skeleton element -- an animated pulse placeholder box. */
export function Skeleton({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[#0f1f1a]/10 ${className}`}
    />
  )
}

/**
 * Mimics an appointment card (used on the appointments page).
 * Matches: rounded-3xl, border, p-5, inner customer bar, status badge.
 */
export function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-5 shadow-sm">
      {/* Title row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
      {/* Customer bar */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
      </div>
      {/* Optional description placeholder */}
      <Skeleton className="mt-3 h-3 w-3/4 rounded-lg" />
    </div>
  )
}

/**
 * Mimics a customer card (mobile layout on customers page).
 * Matches: rounded-3xl, border, p-4, avatar circle, name/phone.
 */
export function SkeletonCustomerCard() {
  return (
    <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28 rounded-lg" />
            <Skeleton className="h-3 w-24 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-3 w-40 rounded-lg" />
      <Skeleton className="mt-2 h-3 w-24 rounded-lg" />
    </div>
  )
}

/**
 * Mimics a table row in the customers table (desktop layout).
 * Matches: px-6 py-4 cells with avatar, name, phone, email, date, actions.
 */
export function SkeletonTableRow() {
  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28 rounded-lg" />
            <Skeleton className="h-3 w-36 rounded-lg" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-28 rounded-lg" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-36 rounded-lg" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-20 rounded-lg" />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </td>
    </tr>
  )
}

/**
 * Mimics a call log list item on the calls page.
 * Matches: px-6 py-4, avatar, customer name/phone, date/duration, outcome badge.
 */
export function SkeletonCallRow() {
  return (
    <li className="px-6 py-4">
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 min-w-0 space-y-1.5">
          <Skeleton className="h-4 w-36 rounded-lg" />
          <Skeleton className="h-3 w-48 rounded-lg" />
        </div>
        <div className="space-y-1.5 text-right">
          <Skeleton className="ml-auto h-3 w-32 rounded-lg" />
          <Skeleton className="ml-auto h-3 w-20 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </li>
  )
}

/**
 * Renders multiple skeleton cards for appointment loading state.
 */
export function SkeletonAppointmentList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">
          <span className="h-2 w-2 rounded-full bg-[#0f1f1a]/20" />
          <Skeleton className="h-3 w-16 rounded-lg" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Renders skeleton rows for the customers table (desktop) and cards (mobile).
 */
export function SkeletonCustomerList({ count = 5 }: { count?: number }) {
  return (
    <>
      {/* Mobile skeleton cards */}
      <div className="sm:hidden space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCustomerCard key={i} />
        ))}
      </div>

      {/* Desktop skeleton table */}
      <div className="hidden sm:block rounded-3xl border border-[#0f1f1a]/10 bg-white/90 shadow-sm">
        <table className="min-w-full divide-y divide-[#0f1f1a]/10">
          <thead className="bg-[#f8f5ef]">
            <tr>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Customer</th>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Phone</th>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Email</th>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Created</th>
              <th className="px-6 py-4 text-right text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0f1f1a]/10">
            {Array.from({ length: count }).map((_, i) => (
              <SkeletonTableRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/**
 * Renders skeleton rows for the calls list page.
 */
export function SkeletonCallList({ count = 5 }: { count?: number }) {
  return (
    <ul className="divide-y divide-[#0f1f1a]/10">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCallRow key={i} />
      ))}
    </ul>
  )
}
