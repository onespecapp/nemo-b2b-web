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

export type NoticePeriod = '24h' | '48h' | '72h'
export type FeeOption = 'none' | '25' | '50' | 'full' | 'custom'
export type PolicyStyle = 'lenient' | 'standard' | 'strict'

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

const industryTerms: Record<IndustryKey, { clientWord: string; serviceWord: string; locationWord: string }> = {
  dental: { clientWord: 'patient', serviceWord: 'appointment', locationWord: 'office' },
  salon: { clientWord: 'client', serviceWord: 'appointment', locationWord: 'salon' },
  auto_repair: { clientWord: 'customer', serviceWord: 'service appointment', locationWord: 'shop' },
  medical: { clientWord: 'patient', serviceWord: 'appointment', locationWord: 'clinic' },
  spa: { clientWord: 'guest', serviceWord: 'appointment', locationWord: 'spa' },
  pet_grooming: { clientWord: 'client', serviceWord: 'grooming appointment', locationWord: 'salon' },
  fitness: { clientWord: 'member', serviceWord: 'session', locationWord: 'studio' },
  tutoring: { clientWord: 'student', serviceWord: 'session', locationWord: 'center' },
  other: { clientWord: 'client', serviceWord: 'appointment', locationWord: 'location' },
}

export interface PolicyInput {
  businessName: string
  industry: IndustryKey
  noticePeriod: NoticePeriod
  cancellationFee: FeeOption
  cancellationFeeCustom: string
  noShowFee: FeeOption
  noShowFeeCustom: string
  policyStyle: PolicyStyle
  includeLateArrival: boolean
}

function feeText(option: FeeOption, custom: string, serviceWord: string): string {
  switch (option) {
    case 'none': return 'no fee'
    case '25': return 'a $25 fee'
    case '50': return 'a $50 fee'
    case 'full': return `the full cost of the scheduled ${serviceWord}`
    case 'custom': return custom ? `a $${custom} fee` : 'a fee'
    default: return 'a fee'
  }
}

function noticeText(period: NoticePeriod): string {
  switch (period) {
    case '24h': return '24 hours'
    case '48h': return '48 hours'
    case '72h': return '72 hours'
  }
}

export function generatePolicy(input: PolicyInput): string {
  const biz = input.businessName || '[Business Name]'
  const terms = industryTerms[input.industry]
  const notice = noticeText(input.noticePeriod)
  const cancelFee = feeText(input.cancellationFee, input.cancellationFeeCustom, terms.serviceWord)
  const noShowFee = feeText(input.noShowFee, input.noShowFeeCustom, terms.serviceWord)
  const client = terms.clientWord
  const clients = client + 's'
  const service = terms.serviceWord
  const location = terms.locationWord

  const styleIntro: Record<PolicyStyle, string> = {
    lenient: `At ${biz}, we understand that life can be unpredictable. We have created this policy to ensure fairness for all of our ${clients} while remaining as flexible as possible.`,
    standard: `At ${biz}, we value your time and ours. To maintain efficient scheduling and provide the best service to all of our ${clients}, we have established the following cancellation and no-show policy.`,
    strict: `At ${biz}, every ${service} slot is reserved exclusively for one ${client}. When a ${client} cancels without adequate notice or fails to show up, that time cannot be offered to others in need. To ensure fair access for all ${clients}, we enforce the following policy.`,
  }

  const sections: string[] = []

  // Title
  sections.push(`CANCELLATION & NO-SHOW POLICY\n${biz}\n`)

  // Introduction
  sections.push(styleIntro[input.policyStyle])

  // Cancellation Policy
  let cancelSection = `\n\nCANCELLATION POLICY\n\nWe require at least ${notice} notice for any cancellation or rescheduling of a scheduled ${service}.`

  if (input.cancellationFee === 'none') {
    cancelSection += ` There is no charge for cancellations made within this timeframe.`
    if (input.policyStyle !== 'lenient') {
      cancelSection += ` Late cancellations (less than ${notice} notice) may be subject to a fee at our discretion.`
    }
  } else {
    cancelSection += ` Cancellations made with less than ${notice} notice will be subject to ${cancelFee}.`
  }

  sections.push(cancelSection)

  // No-Show Policy
  let noShowSection = `\n\nNO-SHOW POLICY\n\nA "no-show" is defined as a ${client} who misses a scheduled ${service} without providing any prior notice.`

  if (input.noShowFee === 'none') {
    noShowSection += ` While we do not currently charge a no-show fee, repeated no-shows may result in the requirement of a deposit for future bookings.`
  } else {
    noShowSection += ` No-shows will be charged ${noShowFee}.`
    if (input.policyStyle === 'strict') {
      noShowSection += ` After two consecutive no-shows, we reserve the right to require a deposit for all future ${service}s or to decline future bookings.`
    }
  }

  sections.push(noShowSection)

  // Late Arrival Policy
  if (input.includeLateArrival) {
    let lateSection = `\n\nLATE ARRIVAL POLICY\n\n`
    if (input.policyStyle === 'lenient') {
      lateSection += `If you arrive late, we will do our best to accommodate your full ${service}. However, if your late arrival would impact the next scheduled ${client}, your ${service} may need to be shortened or rescheduled.`
    } else if (input.policyStyle === 'standard') {
      lateSection += `${clients.charAt(0).toUpperCase() + clients.slice(1)} arriving more than 15 minutes late may need to have their ${service} shortened to avoid disrupting other scheduled ${clients}. If insufficient time remains, the ${service} may need to be rescheduled, and the late cancellation policy may apply.`
    } else {
      lateSection += `${clients.charAt(0).toUpperCase() + clients.slice(1)} who arrive more than 10 minutes past their scheduled time will be considered a no-show. The ${service} will be forfeited, and the no-show fee will apply. We encourage all ${clients} to arrive 5-10 minutes early.`
    }
    sections.push(lateSection)
  }

  // How to Cancel/Reschedule
  sections.push(`\n\nHOW TO CANCEL OR RESCHEDULE\n\nTo cancel or reschedule your ${service}, please contact us at least ${notice} in advance by:\n• Calling our ${location} directly\n• Replying to your appointment confirmation message\n• Contacting us through our website`)

  // Acknowledgment
  const ackStyle: Record<PolicyStyle, string> = {
    lenient: `\n\nWe appreciate your understanding and cooperation. Our goal is to provide excellent service to every ${client}, and your consideration in notifying us of changes helps us achieve that.\n\nThank you for choosing ${biz}.`,
    standard: `\n\nBy scheduling a ${service} with ${biz}, you acknowledge and agree to this cancellation and no-show policy. We will provide a reminder of your upcoming ${service} as a courtesy, but it remains the ${client}'s responsibility to keep track of scheduled ${service}s.\n\nThank you for choosing ${biz}.`,
    strict: `\n\nBy scheduling a ${service} with ${biz}, you acknowledge and agree to this cancellation and no-show policy. This policy applies to all ${clients} without exception. Reminder notifications are provided as a courtesy and do not affect the applicability of this policy.\n\nThank you for your understanding.\n\n${biz}`,
  }

  sections.push(ackStyle[input.policyStyle])

  return sections.join('')
}
