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
  MESSAGE_TAKEN: 'bg-[#6366f1]/15 text-[#4338ca]',
  TRANSFERRED: 'bg-[#f97316]/20 text-[#b45309]',
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
  MESSAGE_TAKEN: 'Message Taken',
  TRANSFERRED: 'Transferred',
  DECLINED: 'Declined',
}

// Call type labels
export const callTypeLabels: Record<string, string> = {
  REMINDER: 'Reminder call',
  TEST: 'Test call',
  INBOUND: 'Inbound call',
}

// Call type styles
export const callTypeStyles: Record<string, string> = {
  REMINDER: 'bg-[#0f766e]/10 text-[#0f766e]',
  TEST: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70',
  INBOUND: 'bg-[#8b5cf6]/15 text-[#6d28d9]',
}

// Message urgency styles
export const messageUrgencyStyles: Record<string, string> = {
  normal: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70',
  urgent: 'bg-[#ef4444]/15 text-[#991b1b]',
}

// Message urgency labels
export const messageUrgencyLabels: Record<string, string> = {
  normal: 'Normal',
  urgent: 'Urgent',
}

