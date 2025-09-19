export function Testimonials() {
  const testimonials = [
    {
      quote:
        'Mind Voyage has completely transformed my morning routine. The daily reflections help me stay grounded and intentional throughout the day.',
      author: 'Sarah Chen',
      role: 'Product Designer',
      avatar: 'SC',
    },
    {
      quote:
        'I love how private and secure it feels. Finally, a habit tracker that doesn&rsquo;t feel like it&rsquo;s spying on me.',
      author: 'Marcus Williams',
      role: 'Software Engineer',
      avatar: 'MW',
    },
    {
      quote:
        'The Stoic prompts have deepened my self-awareness in ways I never expected. This isn&rsquo;t just habit tracking&mdash;it&rsquo;s personal growth.',
      author: 'Elena Rodriguez',
      role: 'Life Coach',
      avatar: 'ER',
    },
  ]

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--mv-color-text)] mb-4">
            Trusted by Mindful Habit Builders
          </h2>
          <p className="text-lg muted">
            Hear from people who&rsquo;ve transformed their lives through
            consistent reflection
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card">
              <blockquote className="space-y-4">
                <p className="text-[var(--mv-color-text-subtle)] leading-relaxed italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--mv-color-cta)] to-[var(--mv-brand-primary-600)] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--mv-color-text)]">
                      {testimonial.author}
                    </div>
                    <div className="text-sm muted">{testimonial.role}</div>
                  </div>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
