"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function StripeWebhookTester() {
  const [payload, setPayload] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSendWebhook = async () => {
    setLoading(true)
    setResult(null)
    try {
      const parsedPayload = JSON.parse(payload)
      const response = await fetch("/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // In a real scenario, Stripe sends a 'stripe-signature' header.
          // For local testing, you might need to mock this or use Stripe CLI.
          // For this test, we'll omit it and rely on the API route's GET method for basic check.
        },
        body: JSON.stringify(parsedPayload),
      })

      const data = await response.json()
      if (response.ok) {
        setResult(`Success: ${data.message}`)
        toast({
          title: "Webhook Sent Successfully",
          description: data.message,
        })
      } else {
        setResult(`Error: ${data.message || "Failed to send webhook."}`)
        toast({
          title: "Webhook Send Failed",
          description: data.message || "An unexpected error occurred.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setResult(`Error: ${error.message || "Invalid JSON payload."}`)
      toast({
        title: "Error",
        description: error.message || "Invalid JSON payload.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stripe Webhook Tester</CardTitle>
        <CardDescription>Send a mock Stripe webhook payload to your `/api/webhooks/stripe` endpoint.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="webhook-payload">Webhook Payload (JSON)</Label>
          <Textarea
            id="webhook-payload"
            rows={10}
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder={`{\n  "id": "evt_...",\n  "object": "event",\n  "type": "customer.subscription.created",\n  "data": {\n    "object": {\n      "id": "sub_...",\n      "customer": "cus_..."\n    }\n  }\n}`}
          />
        </div>
        <Button onClick={handleSendWebhook} disabled={loading || !payload}>
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Send Webhook
        </Button>
        {result && (
          <div
            className={`mt-4 rounded-md p-3 text-sm ${
              result.startsWith("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {result}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
