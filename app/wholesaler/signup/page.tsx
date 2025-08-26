"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2 } from "lucide-react"
import Link from "next/link"

export default function WholesalerSignup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Building2 className="h-8 w-8 mx-auto text-blue-600 mb-2" />
          <CardTitle>Wholesaler Signup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" />
          </div>
          <div>
            <Label>Promo Code</Label>
            <Input placeholder="Optional" />
          </div>
          <Button className="w-full">Sign Up - $149/mo</Button>
          <Link href="/" className="block text-center text-blue-600">← Back</Link>
        </CardContent>
      </Card>
    </div>
  )
}
