"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Gift } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function PromoCodeGenerator() {
  const [formData, setFormData] = useState({
    days: "7",
    quantity: "1", 
    description: ""
  })
  const [generatedCodes, setGeneratedCodes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/promo-codes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          days: parseInt(formData.days),
          quantity: parseInt(formData.quantity),
          description: formData.description
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setGeneratedCodes(data.codes)
        toast({ title: "Promo codes generated successfully!" })
      } else {
        toast({ title: "Error generating codes", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Failed to generate codes", variant: "destructive" })
    }
    setLoading(false)
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({ title: "Code copied to clipboard!" })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            <CardTitle>Promo Code Generator</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="days">Trial Days</Label>
              <Select value={formData.days} onValueChange={(value) => setFormData({...formData, days: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                type="number" 
                min="1" 
                max="100"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input 
                placeholder="Optional"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? "Generating..." : "Generate Promo Codes"}
          </Button>
        </CardContent>
      </Card>

      {generatedCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {generatedCodes.map((codeData, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{codeData.code}</Badge>
                    <span className="text-sm text-gray-600">{codeData.days_valid} days</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyCode(codeData.code)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}