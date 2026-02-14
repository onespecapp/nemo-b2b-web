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

export const industryIcons: Record<IndustryKey, string> = {
  dental: '🦷',
  salon: '✂️',
  auto_repair: '🔧',
  medical: '🏥',
  spa: '🧖',
  pet_grooming: '🐾',
  fitness: '💪',
  tutoring: '📚',
  other: '📋',
}

export interface CardInput {
  businessName: string
  industry: IndustryKey
  customerName: string
  serviceName: string
  date: string
  time: string
  phone: string
  address: string
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '_______________'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return '______'
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function generateCardText(input: CardInput): string {
  const biz = input.businessName || '[Business Name]'
  const name = input.customerName || '[Customer Name]'
  const service = input.serviceName || '[Service]'
  const date = formatDate(input.date)
  const time = formatTime(input.time)
  const phone = input.phone || '[Phone Number]'
  const address = input.address || '[Business Address]'
  const icon = industryIcons[input.industry] || '📋'

  return `${icon} ${biz}
━━━━━━━━━━━━━━━━━━━━━━━━━

APPOINTMENT REMINDER CARD

For: ${name}
Service: ${service}
Date: ${date}
Time: ${time}

━━━━━━━━━━━━━━━━━━━━━━━━━

📞 ${phone}
📍 ${address}

To reschedule or cancel, please call us
at least 24 hours in advance.

We look forward to seeing you!`
}
