"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export function EndToEndTester() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "User Registration E2E", status: "pending" },
    { name: "Authentication E2E", status: "pending" },
    { name: "Dashboard Access E2E", status: "pending" },
    { name: "Subscription Flow E2E", status: "pending" },
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
    await runTest("User Registration E2E", "/api/test/user-registration")
    await runTest("Authentication E2E", "/api/test/auth")
    await runTest("Dashboard Access E2E", "/api/test/dashboard-access")
    await runTest("Subscription Flow E2E", "/api/test/subscription")
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
        <CardTitle>End-to-End User Flow Tests</CardTitle>
        <CardDescription>
          Simulate complete user journeys to ensure core application flows are functional.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button onClick={runAllTests} className="w-full">
            Run All E2E Tests
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
