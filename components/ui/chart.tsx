import * as React from "react"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("relative w-full", className)} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("rounded-md border", className)} {...props} />
})
Chart.displayName = "Chart"

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  value?: string | number
  name?: string
  color?: string
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ className, label, value, name, color, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-1", className)} {...props}>
        {label && <p className="text-sm font-medium">{label}</p>}
        {name && value && color ? (
          <p className="flex items-center justify-between space-x-2">
            <span className="text-xs text-muted-foreground">{name}</span>
            <span className="font-bold">
              {value}
              <span className="ml-2 text-xs text-muted-foreground">{/* You can add units here */}</span>
            </span>
          </p>
        ) : null}
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("bg-popover p-2 text-sm shadow-md", className)} {...props} />
  },
)
ChartTooltip.displayName = "ChartTooltip"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-wrap items-center gap-4", className)} {...props} />
  },
)
ChartLegend.displayName = "ChartLegend"

interface ChartLegendItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  color?: string
}

const ChartLegendItem = React.forwardRef<HTMLDivElement, ChartLegendItemProps>(
  ({ className, name, color, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center space-x-2 text-sm", className)} {...props}>
        <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span>{name}</span>
      </div>
    )
  },
)
ChartLegendItem.displayName = "ChartLegendItem"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem }

