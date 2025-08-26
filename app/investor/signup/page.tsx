"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp } from "lucide-react"
import Link from "next/link"

export default function InvestorSignup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
          <CardTitle>Investor Signup</CardTitle>
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
            <Label>Investment Budget</Label>
            <Input placeholder="$50,000+" />
          </div>
          <div>
            <Label>Promo Code</Label>
            <Input placeholder="Optional" />
          </div>
          <Button className="w-full bg-green-600">Join as Investor</Button>
          <div className="text-xs text-center text-gray-500">
            $49 per bid • 1% closing fee • 10% overage fee
          </div>
          <Link href="/" className="block text-center text-blue-600">← Back</Link>
        </CardContent>
      </Card>
    </div>
  )
}
