import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted",
        !className?.includes("animate-shimmer") && "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
