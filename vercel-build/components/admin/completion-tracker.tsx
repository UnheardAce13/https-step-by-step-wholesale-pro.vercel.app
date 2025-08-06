"use client"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle } from "lucide-react"

interface CompletionTrackerProps {
  title: string
  description: string
  progress: number // 0-100
  status: "pending" | "in-progress" | "completed" | "failed"
  details?: string
}

export function CompletionTracker({ title, description, progress, status, details }: CompletionTrackerProps) {
  const statusColor =
    status === "completed"
      ? "text-green-500"
      : status === "failed"
        ? "text-red-500"
        : status === "in-progress"
          ? "text-blue-500"
          : "text-gray-500"

  const statusIcon =
    status === "completed" ? (
      <CheckCircle2 className="size-5 text-green-500" />
    ) : status === "failed" ? (
      <XCircle className="size-5 text-red-500" />
    ) : null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {statusIcon}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Progress: {progress}%</span>
          <span className={cn("text-sm font-medium capitalize", statusColor)}>{status.replace("-", " ")}</span>
        </div>
        <Progress value={progress} className="w-full" />
        {details && <p className="mt-2 text-sm text-muted-foreground">{details}</p>}
      </CardContent>
    </Card>
  )
}
