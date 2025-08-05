import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl">
          Wholesale Pro SaaS Platform
        </h1>
        <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">
          Your all-in-one solution for managing wholesale operations, connecting with investors, and streamlining your
          business.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="px-8 py-3 text-lg">
            <Link href="/wholesaler">Wholesaler Dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-8 py-3 text-lg bg-transparent">
            <Link href="/investor">Investor Dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="px-8 py-3 text-lg">
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        </div>
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">Test Your Platform</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Ensure all integrations and core functionalities are working as expected.
          </p>
          <Button asChild size="lg" variant="default" className="px-8 py-3 text-lg">
            <Link href="/test-suite">Run Test Suite</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
