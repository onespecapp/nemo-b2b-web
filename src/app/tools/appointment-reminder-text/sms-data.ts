export type IndustryKey =
  | 'dental'
  | 'salon'
  | 'auto_repair'
  | 'medical'
  | 'spa'
  | 'pet_grooming'
  | 'fitness'
  | 'tutoring'
  | 'other'

export type MessageType =
  | 'confirmation'
  | 'day_before'
  | 'same_day'
  | 'reschedule'
  | 'no_show'

export const industries: { value: IndustryKey; label: string }[] = [
  { value: 'dental', label: 'Dental' },
  { value: 'salon', label: 'Salon / Barbershop' },
  { value: 'auto_repair', label: 'Auto Repair' },
  { value: 'medical', label: 'Medical Clinic' },
  { value: 'spa', label: 'Spa / Wellness' },
  { value: 'pet_grooming', label: 'Pet Grooming' },
  { value: 'fitness', label: 'Fitness / Training' },
  { value: 'tutoring', label: 'Tutoring' },
  { value: 'other', label: 'Other' },
]

export const messageTypes: { value: MessageType; label: string }[] = [
  { value: 'confirmation', label: 'Booking Confirmation' },
  { value: 'day_before', label: 'Day-Before Reminder' },
  { value: 'same_day', label: 'Same-Day Reminder' },
  { value: 'reschedule', label: 'Reschedule Request' },
  { value: 'no_show', label: 'No-Show Follow-Up' },
]

const industryTerms: Record<IndustryKey, { word: string; location: string }> = {
  dental: { word: 'appointment', location: 'office' },
  salon: { word: 'appointment', location: 'salon' },
  auto_repair: { word: 'service appointment', location: 'shop' },
  medical: { word: 'appointment', location: 'clinic' },
  spa: { word: 'appointment', location: 'spa' },
  pet_grooming: { word: 'grooming appointment', location: 'salon' },
  fitness: { word: 'session', location: 'studio' },
  tutoring: { word: 'session', location: 'center' },
  other: { word: 'appointment', location: 'location' },
}

export interface SmsInput {
  businessName: string
  industry: IndustryKey
  customerName: string
  serviceName: string
  date: string
  time: string
  messageType: MessageType
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '[Date]'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(timeStr: string): string {
  if (!timeStr) return '[Time]'
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function generateSmsTemplates(input: SmsInput): string[] {
  const terms = industryTerms[input.industry]
  const name = input.customerName || '[Name]'
  const biz = input.businessName || '[Business]'
  const service = input.serviceName || terms.word
  const date = formatDate(input.date)
  const time = formatTime(input.time)

  const templates: Record<MessageType, string[]> = {
    confirmation: [
      `Hi ${name}, your ${service} at ${biz} is confirmed for ${date} at ${time}. Reply C to confirm or call us to reschedule. See you soon!`,
      `${biz}: Hi ${name}! Your ${service} is booked for ${date} at ${time}. We look forward to seeing you! Reply STOP to opt out.`,
      `Thanks for booking with ${biz}, ${name}! Your ${service} is set for ${date} at ${time}. Need to change? Reply R or call us.`,
    ],
    day_before: [
      `Reminder from ${biz}: Hi ${name}, your ${service} is tomorrow at ${time}. Reply C to confirm or R to reschedule. Thank you!`,
      `Hi ${name}! Just a reminder that your ${service} at ${biz} is tomorrow, ${date}, at ${time}. Can't make it? Let us know!`,
      `${biz} reminder: ${name}, we'll see you tomorrow at ${time} for your ${service}. Please arrive 5 min early. Reply C to confirm.`,
    ],
    same_day: [
      `Hi ${name}, this is ${biz}. Reminder: your ${service} is today at ${time}. We look forward to seeing you at our ${terms.location}!`,
      `${biz}: Hey ${name}! Quick reminder — your ${service} is today at ${time}. See you soon!`,
      `Reminder: ${name}, your ${service} at ${biz} is in a few hours (${time} today). Please let us know if anything changes.`,
    ],
    reschedule: [
      `Hi ${name}, ${biz} here. We need to reschedule your ${service} on ${date} at ${time}. Please call us or reply with your preferred time.`,
      `${biz}: Hi ${name}, unfortunately we need to adjust your ${service} time. Can you call us to find a new slot? We apologize for the inconvenience.`,
      `Hey ${name}, it's ${biz}. We had a change in schedule and need to move your ${service}. Reply or call us and we'll find a time that works!`,
    ],
    no_show: [
      `Hi ${name}, we missed you at ${biz} today for your ${service}. We hope everything is okay! Call us to rebook at your convenience.`,
      `${biz}: Hey ${name}, we noticed you weren't able to make your ${service} today. No worries — reply or call us to reschedule.`,
      `Hi ${name}, this is ${biz}. We're sorry we missed you today! Would you like to rebook your ${service}? Reply YES or call us anytime.`,
    ],
  }

  return templates[input.messageType] || []
}
