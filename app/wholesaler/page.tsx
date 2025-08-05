import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function WholesalerDashboardPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Wholesaler Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Properties</CardTitle>
            <CardDescription>View and manage your listed properties.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/wholesaler/properties">View Properties</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Deal</CardTitle>
            <CardDescription>Create a new property listing or deal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/wholesaler/new-deal">Create New Deal</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Offers Received</CardTitle>
            <CardDescription>Review offers from investors on your properties.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/wholesaler/offers">View Offers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
