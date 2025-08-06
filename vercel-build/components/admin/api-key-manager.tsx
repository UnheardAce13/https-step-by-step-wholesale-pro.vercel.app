"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ApiKeys {
  stripe?: string
  telnyx?: string
  docusign?: string
  zapier?: string
  resend?: string
  // Add other API keys as needed
}

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchApiKeys = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/admin/config/api-keys")
        const data = await response.json()
        if (response.ok) {
          setApiKeys(data.apiKeys)
        } else {
          toast({
            title: "Error fetching API keys",
            description: data.message || "An unexpected error occurred.",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Network error fetching API keys.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchApiKeys()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setApiKeys((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/config/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKeys }),
      })
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "API Keys Saved",
          description: data.message,
        })
      } else {
        toast({
          title: "Error saving API keys",
          description: data.message || "An unexpected error occurred.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Network error saving API keys.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
          <CardDescription>Loading API keys...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="size-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key Management</CardTitle>
        <CardDescription>Manage and securely store API keys for various third-party integrations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="stripe">Stripe Secret Key</Label>
          <Input
            id="stripe"
            name="stripe"
            type="password"
            value={apiKeys.stripe || ""}
            onChange={handleChange}
            placeholder="sk_live_..."
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="telnyx">Telnyx API Key</Label>
          <Input
            id="telnyx"
            name="telnyx"
            type="password"
            value={apiKeys.telnyx || ""}
            onChange={handleChange}
            placeholder="KEY00000000000000000000000000000000"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="docusign">DocuSign Integration Key</Label>
          <Input
            id="docusign"
            name="docusign"
            type="password"
            value={apiKeys.docusign || ""}
            onChange={handleChange}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="zapier">Zapier Webhook Secret</Label>
          <Input
            id="zapier"
            name="zapier"
            type="password"
            value={apiKeys.zapier || ""}
            onChange={handleChange}
            placeholder="your-zapier-webhook-secret"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="resend">Resend API Key</Label>
          <Input
            id="resend"
            name="resend"
            type="password"
            value={apiKeys.resend || ""}
            onChange={handleChange}
            placeholder="re_..."
          />
        </div>
        {/* Add more API key inputs as needed */}
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Save API Keys
        </Button>
      </CardContent>
    </Card>
  )
}
