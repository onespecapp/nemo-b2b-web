// Shared timezone list used across customers, settings, and other pages
export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (New York)' },
  { value: 'America/Chicago', label: 'Central Time (Chicago)' },
  { value: 'America/Denver', label: 'Mountain Time (Denver)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
  { value: 'America/Anchorage', label: 'Alaska Time (Anchorage)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (Honolulu)' },
  { value: 'America/Toronto', label: 'Eastern Time (Toronto)' },
  { value: 'America/Vancouver', label: 'Pacific Time (Vancouver)' },
  { value: 'America/Edmonton', label: 'Mountain Time (Edmonton)' },
  { value: 'America/Winnipeg', label: 'Central Time (Winnipeg)' },
  { value: 'America/Halifax', label: 'Atlantic Time (Halifax)' },
  { value: 'Europe/London', label: 'GMT (London)' },
  { value: 'Europe/Paris', label: 'CET (Paris)' },
  { value: 'Europe/Berlin', label: 'CET (Berlin)' },
  { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
  { value: 'Asia/Shanghai', label: 'CST (Shanghai)' },
  { value: 'Asia/Kolkata', label: 'IST (Kolkata)' },
  { value: 'Asia/Dubai', label: 'GST (Dubai)' },
  { value: 'Australia/Sydney', label: 'AEST (Sydney)' },
  { value: 'Australia/Melbourne', label: 'AEST (Melbourne)' },
  { value: 'Pacific/Auckland', label: 'NZST (Auckland)' },
]

// Appointment status styles
export const appointmentStatusStyles: Record<string, string> = {
  SCHEDULED: 'bg-[#0f1f1a] text-white',
  REMINDED: 'bg-[#f97316]/15 text-[#b45309]',
  CONFIRMED: 'bg-[#0f766e]/15 text-[#0f766e]',
  COMPLETED: 'bg-[#0f766e]/15 text-[#0f766e]',
  RESCHEDULED: 'bg-[#fb7185]/15 text-[#be123c]',
  CANCELED: 'bg-[#ef4444]/15 text-[#991b1b]',
  CANCELLED: 'bg-[#ef4444]/15 text-[#991b1b]',
  NO_SHOW: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70',
}

// Appointment status labels
export const appointmentStatusLabels: Record<string, string> = {
  SCHEDULED: 'Scheduled',
  REMINDED: 'Reminded',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  RESCHEDULED: 'Rescheduled',
  CANCELED: 'Canceled',
  CANCELLED: 'Canceled',
  NO_SHOW: 'No Show',
}

// Call outcome styles
export const callOutcomeStyles: Record<string, string> = {
  CONFIRMED: 'bg-[#0f766e]/15 text-[#0f766e]',
  RESCHEDULED: 'bg-[#f97316]/20 text-[#b45309]',
  CANCELED: 'bg-[#ef4444]/15 text-[#991b1b]',
  ANSWERED: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70',
  NO_ANSWER: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70',
  VOICEMAIL: 'bg-[#6366f1]/15 text-[#4338ca]',
  BUSY: 'bg-[#fb7185]/15 text-[#be123c]',
  FAILED: 'bg-[#ef4444]/15 text-[#991b1b]',
  BOOKED: 'bg-[#0f766e]/15 text-[#0f766e]',
  REVIEW_SENT: 'bg-[#6366f1]/15 text-[#4338ca]',
  DECLINED: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/50',
}

// Call outcome labels
export const callOutcomeLabels: Record<string, string> = {
  CONFIRMED: 'Confirmed',
  RESCHEDULED: 'Rescheduled',
  CANCELED: 'Canceled',
  ANSWERED: 'Answered',
  NO_ANSWER: 'No Answer',
  VOICEMAIL: 'Voicemail',
  BUSY: 'Busy',
  FAILED: 'Failed',
  BOOKED: 'Booked',
  REVIEW_SENT: 'Review Sent',
  DECLINED: 'Declined',
}

// Call type labels
export const callTypeLabels: Record<string, string> = {
  REMINDER: 'Reminder call',
  TEST: 'Test call',
  FOLLOW_UP: 'Follow-up call',
  CONFIRMATION: 'Confirmation call',
}

// Campaign call type styles and labels
export const campaignCallTypeStyles: Record<string, string> = {
  RE_ENGAGEMENT: 'bg-[#0f766e]/10 text-[#0f766e]',
  REVIEW_COLLECTION: 'bg-[#f97316]/10 text-[#b45309]',
  NO_SHOW_FOLLOWUP: 'bg-[#6366f1]/10 text-[#4338ca]',
}

export const campaignCallTypeLabels: Record<string, string> = {
  RE_ENGAGEMENT: 'Re-engagement',
  REVIEW_COLLECTION: 'Review',
  NO_SHOW_FOLLOWUP: 'No-Show',
}

// Campaign call status styles and labels
export const campaignStatusStyles: Record<string, string> = {
  PENDING: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70',
  QUEUED: 'bg-[#f97316]/20 text-[#b45309]',
  IN_PROGRESS: 'bg-[#6366f1]/15 text-[#4338ca]',
  COMPLETED: 'bg-[#0f766e]/15 text-[#0f766e]',
  SKIPPED: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/50',
  FAILED: 'bg-[#ef4444]/15 text-[#991b1b]',
}

export const campaignStatusLabels: Record<string, string> = {
  PENDING: 'Scheduled',
  QUEUED: 'Queued',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  SKIPPED: 'Skipped',
  FAILED: 'Failed',
}
