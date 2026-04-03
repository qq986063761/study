"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { TrendDataPoint } from "@/lib/types"

interface TrendChartProps {
  data: TrendDataPoint[]
}

const chartConfig = {
  totalHours: {
    label: "总工时",
    color: "var(--chart-1)",
  },
  avgHours: {
    label: "人均工时",
    color: "var(--chart-2)",
  },
  submittedCount: {
    label: "填报人数",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

type MetricKey = keyof typeof chartConfig

export function TrendChart({ data }: TrendChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("totalHours")

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-foreground">工时趋势</CardTitle>
        <Tabs value={activeMetric} onValueChange={(v) => setActiveMetric(v as MetricKey)}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="totalHours" className="text-xs">总工时</TabsTrigger>
            <TabsTrigger value="avgHours" className="text-xs">人均工时</TabsTrigger>
            <TabsTrigger value="submittedCount" className="text-xs">填报人数</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[activeMetric].color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartConfig[activeMetric].color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                width={50}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={chartConfig[activeMetric].color}
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
