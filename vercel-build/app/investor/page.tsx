import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InvestorDashboardPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Investor Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Available Deals</CardTitle>
            <CardDescription>Browse properties listed by wholesalers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/investor/deals">View Deals</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Offers</CardTitle>
            <CardDescription>Track the offers you've made on properties.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/investor/my-offers">View My Offers</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
            <CardDescription>Manage your acquired properties and investments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/investor/portfolio">View Portfolio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
