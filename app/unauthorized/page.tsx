"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldX } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Unauthorized() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <ShieldX className="h-16 w-16 mx-auto text-red-600 mb-4" />
          <CardTitle className="text-2xl text-red-700">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={() => router.back()} 
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
            
            <Link href="/" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Return to Home
              </Button>
            </Link>
          </div>
          
          <div className="text-sm text-gray-500 mt-6">
            <p>Need access? Contact support:</p>
            <a 
              href="mailto:support@wholesale-pro.com" 
              className="text-blue-600 hover:underline"
            >
              support@wholesale-pro.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}