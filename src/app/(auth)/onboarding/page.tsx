import { redirect } from 'next/navigation'

export default function OnboardingPage() {
  // Redirect to step 1 by default
  redirect('/onboarding/step1' as any)
}
