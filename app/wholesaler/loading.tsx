import { Loader2 } from "lucide-react"

export default function WholesalerLoading() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
      <Loader2 className="size-12 animate-spin text-primary" />
    </div>
  )
}
