export type Channel = 'sms' | 'email' | 'phone'
export type Tone = 'professional' | 'friendly' | 'casual'
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

export const industryTerms: Record<
  IndustryKey,
  { greeting: string; serviceWord: string; locationWord: string }
> = {
  dental: { greeting: 'patient', serviceWord: 'appointment', locationWord: 'office' },
  salon: { greeting: 'client', serviceWord: 'appointment', locationWord: 'salon' },
  auto_repair: { greeting: 'customer', serviceWord: 'service appointment', locationWord: 'shop' },
  medical: { greeting: 'patient', serviceWord: 'appointment', locationWord: 'clinic' },
  spa: { greeting: 'guest', serviceWord: 'appointment', locationWord: 'spa' },
  pet_grooming: { greeting: 'pet parent', serviceWord: 'grooming appointment', locationWord: 'salon' },
  fitness: { greeting: 'member', serviceWord: 'session', locationWord: 'studio' },
  tutoring: { greeting: 'student', serviceWord: 'session', locationWord: 'center' },
  other: { greeting: 'customer', serviceWord: 'appointment', locationWord: 'location' },
}

export interface TemplateInput {
  businessName: string
  industry: IndustryKey
  customerName: string
  serviceName: string
  date: string
  time: string
  channel: Channel
  tone: Tone
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '[Date]'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function formatTime(timeStr: string): string {
  if (!timeStr) return '[Time]'
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function generateTemplate(input: TemplateInput): string {
  const terms = industryTerms[input.industry]
  const name = input.customerName || '[Customer Name]'
  const biz = input.businessName || '[Business Name]'
  const service = input.serviceName || terms.serviceWord
  const date = formatDate(input.date)
  const time = formatTime(input.time)

  const key = `${input.channel}_${input.tone}` as const

  const templates: Record<string, string> = {
    // SMS — Professional
    sms_professional: `Hi ${name}, this is ${biz}. This is a reminder of your ${service} on ${date} at ${time}. Please reply C to confirm or R to reschedule. Thank you.`,

    // SMS — Friendly
    sms_friendly: `Hey ${name}! Just a friendly reminder from ${biz} — your ${service} is coming up on ${date} at ${time}. Reply C to confirm or R to reschedule. See you soon!`,

    // SMS — Casual
    sms_casual: `Hi ${name}! Quick heads-up: your ${service} at ${biz} is on ${date} at ${time}. Reply C to confirm or R to reschedule. Can't wait to see you!`,

    // Email — Professional
    email_professional: `Subject: Appointment Reminder — ${service} on ${date}

Dear ${name},

This is a courtesy reminder that your ${service} at ${biz} is scheduled for ${date} at ${time}.

If you need to reschedule or cancel, please contact us at your earliest convenience so we can accommodate other ${terms.greeting}s.

We look forward to seeing you at our ${terms.locationWord}.

Best regards,
${biz}`,

    // Email — Friendly
    email_friendly: `Subject: Your ${service} is coming up!

Hi ${name},

Just a friendly reminder that your ${service} at ${biz} is on ${date} at ${time}.

If anything has changed and you need to reschedule, just let us know — we're happy to find a time that works better.

Looking forward to seeing you at the ${terms.locationWord}!

Warm regards,
The ${biz} Team`,

    // Email — Casual
    email_casual: `Subject: See you on ${date}!

Hey ${name}!

Quick reminder — your ${service} at ${biz} is on ${date} at ${time}.

Need to change the time? No worries at all, just reply to this email and we'll sort it out.

See you at the ${terms.locationWord}!

Cheers,
${biz}`,

    // Phone Script — Professional
    phone_professional: `Hello, may I speak with ${name}? This is [Your Name] calling from ${biz}. I'm calling to confirm your ${service} scheduled for ${date} at ${time}. Will you be able to make it? [PAUSE] Wonderful, we'll see you then. If anything changes, please don't hesitate to call us. Thank you and have a great day.`,

    // Phone Script — Friendly
    phone_friendly: `Hi, is this ${name}? Hey there! This is [Your Name] from ${biz}. I'm just calling to remind you about your ${service} on ${date} at ${time}. Does that still work for you? [PAUSE] Awesome! We'll see you at the ${terms.locationWord}. If you need to change anything, just give us a call. Have a wonderful day!`,

    // Phone Script — Casual
    phone_casual: `Hey ${name}! It's [Your Name] from ${biz}. Just giving you a quick call about your ${service} coming up on ${date} at ${time}. Are we still good? [PAUSE] Great, see you then! If anything comes up, just give us a shout. Talk soon!`,
  }

  return templates[key] || ''
}
