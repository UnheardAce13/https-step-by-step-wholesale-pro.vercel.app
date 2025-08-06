import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function WholesalerOnboardingPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome, Wholesaler!</CardTitle>
          <CardDescription>Let's get you set up to start managing your properties and deals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>To get started, you'll need to complete a few steps to configure your profile and preferences.</p>
          <ul className="list-inside list-disc text-left">
            <li>Complete your profile information.</li>
            <li>Set up your property listing preferences.</li>
            <li>Connect your payment accounts.</li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/wholesaler/dashboard">Start Onboarding</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
