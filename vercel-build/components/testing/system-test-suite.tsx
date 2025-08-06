"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TestReportSummary } from "./test-report-summary"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface TestResult {
  name: string
  status: "pending" | "running" | "success" | "failed"
  message?: string
}

export function SystemTestSuite() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Supabase Connection", status: "pending" },
    { name: "Stripe API", status: "pending" },
    { name: "Stripe Webhook", status: "pending" },
    { name: "Telnyx SMS", status: "pending" },
    { name: "DocuSign API", status: "pending" },
    { name: "Zapier Webhook", status: "pending" },
  ])

  const runTest = async (testName: string, apiEndpoint: string) => {
    setTests((prev) =>
      prev.map((test) => (test.name === testName ? { ...test, status: "running", message: undefined } : test)),
    )
    try {
      const response = await fetch(apiEndpoint)
      const data = await response.json()
      if (response.ok && data.status === "success") {
        setTests((prev) =>
          prev.map((test) => (test.name === testName ? { ...test, status: "success", message: data.message } : test)),
        )
      } else {
        setTests((prev) =>
          prev.map((test) =>
            test.name === testName ? { ...test, status: "failed", message: data.message || "Test failed" } : test,
          ),
        )
        toast({
          title: `Test Failed: ${testName}`,
          description: data.message || "An unexpected error occurred.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setTests((prev) =>
        prev.map((test) =>
          test.name === testName ? { ...test, status: "failed", message: error.message || "Network error" } : test,
        ),
      )
      toast({
        title: `Test Failed: ${testName}`,
        description: error.message || "Network error or unhandled exception.",
        variant: "destructive",
      })
    }
  }

  const runAllTests = async () => {
    setTests((prev) => prev.map((test) => ({ ...test, status: "pending", message: undefined }))) // Reset all tests
    await runTest("Supabase Connection", "/api/test/supabase")
    await runTest("Stripe API", "/api/test/stripe")
    await runTest("Stripe Webhook", "/api/test/stripe-webhook")
    await runTest("Telnyx SMS", "/api/test/telnyx")
    await runTest("DocuSign API", "/api/test/docusign")
    await runTest("Zapier Webhook", "/api/test/zapier")
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return <span className="size-5 rounded-full bg-gray-300 dark:bg-gray-700" />
      case "running":
        return <Loader2 className="size-5 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle2 className="size-5 text-green-500" />
      case "failed":
        return <XCircle className="size-5 text-red-500" />
      default:
        return null
    }
  }

  const successfulTests = tests.filter((test) => test.status === "success").length
  const failedTests = tests.filter((test) => test.status === "failed").length
  const totalTests = tests.length

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>System Test Suite</CardTitle>
        <CardDescription>Verify connections to core services and external APIs.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button onClick={runAllTests} className="w-full">
            Run All Integration Tests
          </Button>
        </div>
        <TestReportSummary successful={successfulTests} failed={failedTests} total={totalTests} />
        <Separator className="my-4" />
        <div className="space-y-3">
          {tests.map((test) => (
            <div key={test.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <span className="font-medium">{test.name}</span>
              </div>
              {test.message && (
                <span className={`text-sm ${test.status === "failed" ? "text-red-500" : "text-muted-foreground"}`}>
                  {test.message}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
