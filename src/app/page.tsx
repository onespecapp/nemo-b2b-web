import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Nemo</span>
            </div>
            
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                Get Started Free
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Now with AI-powered voice calls
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Reduce No-Shows by{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">50%</span>{' '}
              with Automated Reminders
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              AI-powered phone calls remind your customers about appointments. 
              Simple setup, powerful results. Stop losing money to missed appointments.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/signup" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2">
                Start Free Trial
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto text-gray-700 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                See How It Works
              </a>
            </div>
            
            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white" />
                  ))}
                </div>
                <span>500+ businesses trust us</span>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>
          
          {/* Hero image/mockup */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden mx-auto max-w-5xl">
              <div className="bg-gray-800/50 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center text-xs text-gray-400">Nemo Dashboard</div>
              </div>
              <div className="p-4 sm:p-8">
                {/* Mock dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Appointments Today', value: '24', change: '+12%' },
                    { label: 'Calls Made', value: '156', change: '+8%' },
                    { label: 'No-Show Rate', value: '4.2%', change: '-23%', positive: true },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-700/50 rounded-xl p-4">
                      <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-white">{stat.value}</span>
                        <span className={`text-xs ${stat.positive || stat.change.startsWith('-') ? 'text-green-400' : 'text-blue-400'}`}>{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-3">Upcoming Reminders</div>
                  <div className="space-y-2">
                    {[
                      { name: 'Sarah Johnson', time: '2:30 PM', type: 'Dental Checkup' },
                      { name: 'Mike Chen', time: '3:00 PM', type: 'Consultation' },
                      { name: 'Emily Brown', time: '4:15 PM', type: 'Follow-up' },
                    ].map((apt, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-600/50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
                          <div>
                            <div className="text-white text-sm font-medium">{apt.name}</div>
                            <div className="text-gray-400 text-xs">{apt.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-sm">{apt.time}</div>
                          <div className="text-green-400 text-xs">Call scheduled</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Eliminate No-Shows
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for healthcare providers, salons, and service businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                title: 'AI Voice Calls',
                description: 'Natural-sounding AI makes personalized reminder calls that feel human. Customers can confirm, reschedule, or cancel.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Smart Scheduling',
                description: 'Automatically schedule calls at the optimal time before appointments. Set your preferences, we handle the rest.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Analytics Dashboard',
                description: 'Track call success rates, no-show trends, and ROI. Make data-driven decisions to improve your practice.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Flexible Timing',
                description: 'Choose when to call - 24 hours before, morning of, or custom intervals. Works around your schedule.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                ),
                title: 'Custom Messages',
                description: 'Personalize call scripts with your business name, appointment details, and special instructions.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'HIPAA Compliant',
                description: 'Enterprise-grade security for healthcare providers. Your patient data is protected and encrypted.',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No technical skills required. Set up your account and start reducing no-shows today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '1',
                title: 'Add Your Customers',
                description: 'Import your customer list or add them manually. Include phone numbers and preferences.',
              },
              {
                step: '2',
                title: 'Schedule Appointments',
                description: 'Create appointments and set when reminder calls should go out.',
              },
              {
                step: '3',
                title: 'We Handle the Rest',
                description: 'Our AI makes the calls, tracks responses, and updates you on confirmations.',
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent -translate-x-8" />
                )}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/25">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '50%', label: 'Reduction in no-shows' },
              { value: '10K+', label: 'Calls made daily' },
              { value: '98%', label: 'Call completion rate' },
              { value: '4.9★', label: 'Customer rating' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                period: 'forever',
                description: 'Perfect for trying out Nemo',
                features: ['50 calls/month', '1 user', 'Basic analytics', 'Email support'],
                cta: 'Get Started',
                popular: false,
              },
              {
                name: 'Pro',
                price: '$49',
                period: '/month',
                description: 'For growing practices',
                features: ['500 calls/month', '5 users', 'Advanced analytics', 'Priority support', 'Custom messages', 'API access'],
                cta: 'Start Free Trial',
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                description: 'For large organizations',
                features: ['Unlimited calls', 'Unlimited users', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'HIPAA BAA'],
                cta: 'Contact Sales',
                popular: false,
              },
            ].map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-8 ${plan.popular ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/25 scale-105' : 'bg-white border-2 border-gray-100'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-lg font-semibold mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={plan.popular ? 'text-blue-100' : 'text-gray-500'}>{plan.period}</span>
                </div>
                <p className={`mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <svg className={`w-5 h-5 ${plan.popular ? 'text-blue-200' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/signup" 
                  className={`block w-full py-3 rounded-full text-center font-semibold transition-all ${
                    plan.popular 
                      ? 'bg-white text-blue-600 hover:shadow-lg' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Businesses Like Yours
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Our no-show rate dropped from 15% to under 5% in just two months. The ROI is incredible.",
                author: "Dr. Sarah Chen",
                role: "Dental Practice Owner",
              },
              {
                quote: "The AI calls sound so natural, our patients love it. Setup took less than 10 minutes.",
                author: "Michael Torres",
                role: "Physical Therapy Clinic",
              },
              {
                quote: "Finally, a reminder system that actually works. My staff saves hours every week.",
                author: "Jennifer Kim",
                role: "Salon Owner",
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Eliminate No-Shows?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Join 500+ businesses saving time and money with automated appointment reminders.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all">
            Start Your Free Trial
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="mt-4 text-gray-500 text-sm">No credit card required · 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">Nemo</span>
              </div>
              <p className="text-sm">Automated appointment reminders powered by AI.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">HIPAA</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 Nemo. Powered by Nemo Cares. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
