import { SystemTestSuite } from "@/components/testing/system-test-suite"
import { EndToEndTester } from "@/components/testing/end-to-end-tester"
import { StripeWebhookTester } from "@/components/testing/stripe-webhook-tester"
import { Separator } from "@/components/ui/separator"

export default function TestSuitePage() {
  return (
    <div className="grid gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold">Platform Test Suite</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Run various tests to ensure all integrations and core functionalities of your SaaS platform are working as
        expected.
      </p>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Integration Tests</h2>
        <SystemTestSuite />
      </section>

      <Separator className="my-6" />

      <section>
        <h2 className="mb-4 text-2xl font-semibold">End-to-End User Flow Tests</h2>
        <EndToEndTester />
      </section>

      <Separator className="my-6" />

      <section id="stripe-webhook-tester">
        <h2 className="mb-4 text-2xl font-semibold">Stripe Webhook Tester</h2>
        <StripeWebhookTester />
      </section>
    </div>
  )
}
