"use client"

import { Clock, Users, FileCheck, TrendingUp, Timer, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { KPIData } from "@/lib/types"

interface KPICardsProps {
  data: KPIData
}

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  trend: number
  icon: React.ReactNode
  trendLabel?: string
}

function KPICard({ title, value, unit, trend, icon, trendLabel = "较上期" }: KPICardProps) {
  const isPositive = trend >= 0
  const isNeutral = Math.abs(trend) < 0.1

  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-foreground">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-secondary">
            {icon}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-sm">
          {!isNeutral && (
            <>
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-success" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              )}
              <span className={cn(
                isPositive ? "text-success" : "text-destructive"
              )}>
                {isPositive ? "+" : ""}{trend}%
              </span>
            </>
          )}
          <span className="text-muted-foreground">{trendLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function KPICards({ data }: KPICardsProps) {
  const cards = [
    {
      title: "总工时",
      value: data.totalHours.toLocaleString(),
      unit: "小时",
      trend: data.totalHoursTrend,
      icon: <Clock className="h-5 w-5 text-primary" />,
    },
    {
      title: "人均实际工时",
      value: data.avgHoursPerPerson.toFixed(1),
      unit: "小时",
      trend: data.avgHoursTrend,
      icon: <Users className="h-5 w-5 text-chart-2" />,
    },
    {
      title: "人均标准工时",
      value: data.avgStandardHours.toFixed(1),
      unit: "小时",
      trend: data.avgStandardHoursTrend,
      icon: <Timer className="h-5 w-5 text-chart-3" />,
    },
    {
      title: "填报人数",
      value: data.submittedCount,
      unit: "人",
      trend: data.submittedTrend,
      icon: <FileCheck className="h-5 w-5 text-chart-4" />,
    },
    {
      title: "填报率",
      value: data.submissionRate.toFixed(1),
      unit: "%",
      trend: data.submissionRateTrend,
      icon: <TrendingUp className="h-5 w-5 text-success" />,
    },
    {
      title: "工时饱和率",
      value: data.saturationRate.toFixed(1),
      unit: "%",
      trend: data.saturationRateTrend,
      icon: <TrendingUp className="h-5 w-5 text-chart-1" />,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <KPICard key={card.title} {...card} />
      ))}
    </div>
  )
}
