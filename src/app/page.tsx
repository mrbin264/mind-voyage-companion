import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Next.js MVP Boilerplate
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Production-ready starter with Next.js 15, TypeScript, MongoDB,
            NextAuth, and Azure CI/CD
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="min-w-[180px]">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="min-w-[180px]">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <h3 className="text-lg font-semibold mb-2 text-white">
              🚀 Production Ready
            </h3>
            <p className="text-sm text-zinc-400">
              Next.js 15 with App Router, TypeScript strict mode, and MongoDB
              integration out of the box.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <h3 className="text-lg font-semibold mb-2 text-white">
              🔐 Auth Built-in
            </h3>
            <p className="text-sm text-zinc-400">
              NextAuth v5 with credential and OAuth providers, session
              management included.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <h3 className="text-lg font-semibold mb-2 text-white">
              ☁️ Azure Ready
            </h3>
            <p className="text-sm text-zinc-400">
              Complete CI/CD pipeline with staging auto-deploy and manual
              production release.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-sm text-zinc-500">
            Get started by editing{' '}
            <code className="px-2 py-1 bg-zinc-800 rounded text-zinc-300">
              src/app/page.tsx
            </code>
          </p>
        </div>
      </div>
    </div>
  )
}
