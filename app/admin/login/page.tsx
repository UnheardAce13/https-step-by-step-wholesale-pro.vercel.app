"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (credentials.email === "michael.ceo@joinustoday4wealth.com" && 
        credentials.password === "Iamrich1313$$") {
      toast({ title: "Admin access granted" })
      window.location.href = '/admin/dashboard'
    } else {
      toast({ title: "Invalid credentials", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Shield className="h-8 w-8 mx-auto text-slate-600 mb-2" />
          <CardTitle className="text-lg">Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
            </div>
            <Button type="submit" className="w-full bg-slate-600">Access Admin</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}