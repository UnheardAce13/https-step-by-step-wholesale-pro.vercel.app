import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"

interface TestReportSummaryProps {
  successful: number
  failed: number
  total: number
}

export function TestReportSummary({ successful, failed, total }: TestReportSummaryProps) {
  const completionPercentage = total > 0 ? ((successful / total) * 100).toFixed(0) : 0

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="relative mb-4 flex size-24 items-center justify-center">
          <svg className="size-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-primary"
              strokeWidth="10"
              strokeDasharray={40 * 2 * Math.PI}
              strokeDashoffset={
                40 * 2 * Math.PI - (Number.parseFloat(completionPercentage.toString()) / 100) * 40 * 2 * Math.PI
              }
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <span className="absolute text-2xl font-bold">{completionPercentage}%</span>
        </div>
        <div className="text-center text-lg font-semibold">Tests Completed</div>
        <div className="mt-2 flex gap-4">
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="size-4" />
            <span>{successful} Successful</span>
          </div>
          <div className="flex items-center gap-1 text-red-600">
            <XCircle className="size-4" />
            <span>{failed} Failed</span>
          </div>
        </div>
        <div className="mt-1 text-sm text-muted-foreground">Total: {total}</div>
      </CardContent>
    </Card>
  )
}
