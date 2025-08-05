"use client"

import type React from "react"
import { SettingsSidebar } from "@/components/settings-sidebar"
import { toast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { EnvironmentSetupGuide } from "@/components/admin/environment-setup-guide"
import { ApiKeyManager } from "@/components/admin/api-key-manager"
import { CompletionTracker } from "@/components/admin/completion-tracker"
import { Separator } from "@/components/ui/separator"

const sidebarNavItems = [
  {
    title: "Environment Setup",
    href: "/admin/config",
  },
  {
    title: "API Key Management",
    href: "/admin/config/api-keys",
  },
  {
    title: "System Status",
    href: "/admin/config/system-status",
  },
]

export default function AdminConfigPage() {
  const [activeTab, setActiveTab] = useState("completion")
  const [isSiteUrlSet, setIsSiteUrlSet] = useState(false)
  const [isStripeWebhookSet, setIsStripeWebhookSet] = useState(false)
  const [currentSiteUrl, setCurrentSiteUrl] = useState("")

  const requiredKeys = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "TELNYX_API_KEY",
    "TELNYX_SMS_FROM_NUMBER",
    "DOCUSIGN_INTEGRATION_KEY",
    "DOCUSIGN_SECRET_KEY",
    "DOCUSIGN_USER_ID",
    "ZAPIER_WEBHOOK_SECRET",
    "RESEND_API_KEY", // Added Resend API Key
    "FROM_EMAIL", // Added FROM_EMAIL
  ]

  useEffect(() => {
    // Fetch initial site URL status
    const fetchSiteUrlStatus = async () => {
      const response = await fetch("/api/admin/config/api-keys?key=NEXT_PUBLIC_SITE_URL")
      const data = await response.json()
      if (data.status === "set" && data.value) {
        setIsSiteUrlSet(true)
        setCurrentSiteUrl(data.value)
      } else {
        setIsSiteUrlSet(false)
        setCurrentSiteUrl("")
      }
    }
    fetchSiteUrlStatus()

    // Fetch initial Stripe Webhook status
    const fetchStripeWebhookStatus = async () => {
      const response = await fetch("/api/test/stripe-webhook")
      const data = await response.json()
      setIsStripeWebhookSet(data.status === "success")
    }
    fetchStripeWebhookStatus()
  }, [])

  const handleSiteUrlUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newSiteUrl = formData.get("siteUrl") as string

    try {
      const response = await fetch("/api/admin/config/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyName: "NEXT_PUBLIC_SITE_URL", newValue: newSiteUrl }),
      })
      const data = await response.json()

      if (response.ok) {
        setIsSiteUrlSet(true)
        setCurrentSiteUrl(newSiteUrl)
        toast({
          title: "NEXT_PUBLIC_SITE_URL Updated!",
          description: "Your site URL is now configured. Remember to redeploy for full effect.",
        })
      } else {
        toast({
          title: "Error Updating Site URL",
          description: data.error || "Failed to update site URL.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update site URL: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const handleStripeWebhookSetupComplete = () => {
    setIsStripeWebhookSet(true)
    toast({
      title: "Stripe Webhook Configured!",
      description: "Your Stripe webhook secret is now set.",
    })
  }

  const handleCheckAllEnvVars = async () => {
    try {
      const response = await fetch("/api/admin/config/env-status")
      const data = await response.json()
      if (response.ok) {
        const missing = requiredKeys.filter((key) => !data.envStatus[key])
        if (missing.length > 0) {
          toast({
            title: "Missing Environment Variables",
            description: `The following keys are not set: ${missing.join(", ")}`,
            variant: "destructive",
            duration: 5000,
          })
        } else {
          toast({
            title: "All Environment Variables Set",
            description: "All required environment variables are configured.",
            variant: "success",
          })
        }
      } else {
        throw new Error(data.error || "Failed to check environment variables.")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while checking environment variables.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <SettingsSidebar items={sidebarNavItems} />
      <div className="flex-1 lg:max-w-2xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Environment Setup</h3>
            <p className="text-sm text-muted-foreground">
              Manage and verify your application's environment variables and configurations.
            </p>
          </div>
          <Separator />
          <EnvironmentSetupGuide />
          <ApiKeyManager />
          <CompletionTracker />
        </div>
      </div>
    </div>
  )
}
