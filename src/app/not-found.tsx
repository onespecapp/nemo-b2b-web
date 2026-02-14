import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#0f1f1a]/10 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f97316]/10">
          <svg
            className="h-6 w-6 text-[#f97316]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-[#0f1f1a]">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-[#0f1f1a]/60">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#0f1f1a] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0f1f1a]/90"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-[#0f1f1a]/15 px-6 py-3 text-sm font-semibold text-[#0f1f1a]/70 transition hover:border-[#0f1f1a]/30"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
