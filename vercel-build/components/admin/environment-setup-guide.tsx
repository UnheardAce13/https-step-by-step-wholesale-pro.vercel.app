"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface EnvStatus {
  name: string
  status: "pending" | "checking" | "set" | "not-set"
  value?: string
}

export function EnvironmentSetupGuide() {
  const [envVars, setEnvVars] = useState<EnvStatus[]>([
    { name: "NEXT_PUBLIC_SUPABASE_URL", status: "pending" },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", status: "pending" },
    { name: "SUPABASE_SERVICE_ROLE_KEY", status: "pending" },
    { name: "STRIPE_SECRET_KEY", status: "pending" },
    { name: "STRIPE_WEBHOOK_SECRET", status: "pending" },
    { name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", status: "pending" },
    { name: "TELNYX_API_KEY", status: "pending" },
    { name: "TELNYX_SMS_FROM_NUMBER", status: "pending" },
    { name: "DOCUSIGN_INTEGRATION_KEY", status: "pending" },
    { name: "DOCUSIGN_SECRET_KEY", status: "pending" },
    { name: "DOCUSIGN_USER_ID", status: "pending" },
    { name: "ZAPIER_WEBHOOK_SECRET", status: "pending" },
    { name: "NEXT_PUBLIC_BASE_URL", status: "pending" },
    { name: "RESEND_API_KEY", status: "pending" },
    { name: "FROM_EMAIL", status: "pending" },
  ])

  const checkEnvVar = (varName: string) => {
    const value = process.env[varName as keyof NodeJS.ProcessEnv]
    return value ? "set" : "not-set"
  }

  useEffect(() => {
    // Initial check on client-side load
    setEnvVars((prev) =>
      prev.map((env) => ({
        ...env,
        status: checkEnvVar(env.name),
        value: env.name.startsWith("NEXT_PUBLIC_") ? process.env[env.name as keyof NodeJS.ProcessEnv] : undefined,
      })),
    )
  }, [])

  const handleVerifyAll = async () => {
    setEnvVars((prev) => prev.map((env) => ({ ...env, status: "checking" })))

    // Simulate API calls for server-side variables or more complex checks
    const results = await Promise.all(
      envVars.map(async (env) => {
        if (env.name.startsWith("NEXT_PUBLIC_")) {
          return { ...env, status: checkEnvVar(env.name), value: process.env[env.name as keyof NodeJS.ProcessEnv] }
        } else {
          // For server-side variables, we'd ideally hit a dedicated API endpoint
          // that checks the server-side env var. For this example, we'll mock it.
          // In a real app, you'd have an API route like /api/admin/check-env?var=STRIPE_SECRET_KEY
          await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate network delay
          const isSet = Math.random() > 0.1 // Simulate 90% chance of being set
          return { ...env, status: isSet ? "set" : "not-set" }
        }
      }),
    )
    setEnvVars(results)
    toast({
      title: "Environment Variables Verified",
      description: "All environment variables have been checked.",
    })
  }

  const getStatusIcon = (status: EnvStatus["status"]) => {
    switch (status) {
      case "pending":
        return <span className="size-4 rounded-full bg-gray-300 dark:bg-gray-700" />
      case "checking":
        return <Loader2 className="size-4 animate-spin text-blue-500" />
      case "set":
        return <CheckCircle2 className="size-4 text-green-500" />
      case "not-set":
        return <XCircle className="size-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
        <CardDescription>
          Verify that all required environment variables are correctly configured for your platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button onClick={handleVerifyAll} className="w-full">
            Verify All
          </Button>
        </div>
        <div className="space-y-3">
          {envVars.map((env) => (
            <div key={env.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(env.status)}
                <span className="font-medium">{env.name}</span>
              </div>
              {env.value && <span className="text-sm text-muted-foreground truncate max-w-[150px]">{env.value}</span>}
              <span
                className={`text-sm font-medium capitalize ${
                  env.status === "set"
                    ? "text-green-600"
                    : env.status === "not-set"
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                {env.status === "checking" ? "Checking..." : env.status.replace("-", " ")}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Note: Server-side environment variables (not prefixed with `NEXT_PUBLIC_`) cannot be directly read by the
          browser. Their status is simulated or requires a backend check.
        </p>
      </CardContent>
    </Card>
  )
}
