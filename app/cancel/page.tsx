"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-orange-500">
            <XCircle className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-orange-700">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            You can try again at any time or contact support if you need assistance.
          </p>
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/pricing">Try Again</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}