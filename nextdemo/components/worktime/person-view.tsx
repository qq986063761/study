"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { PersonData } from "@/lib/types"

interface PersonViewProps {
  data: PersonData[]
}

function getSaturationColor(rate: number) {
  if (rate >= 120) return "text-destructive"
  if (rate >= 100) return "text-success"
  if (rate >= 80) return "text-foreground"
  return "text-warning"
}

function getSaturationLabel(rate: number) {
  if (rate >= 120) return "过载"
  if (rate >= 100) return "饱和"
  if (rate >= 80) return "正常"
  return "空闲"
}

export function PersonView({ data }: PersonViewProps) {
  // 计算汇总数据
  const summary = data.reduce(
    (acc, person) => ({
      totalActualHours: acc.totalActualHours + person.totalActualHours,
      totalStandardHours: acc.totalStandardHours + person.totalStandardHours,
    }),
    { totalActualHours: 0, totalStandardHours: 0 }
  )
  const avgSaturationRate = summary.totalStandardHours > 0 
    ? (summary.totalActualHours / summary.totalStandardHours) * 100 
    : 0

  // 统计各状态人数
  const statusCounts = {
    overload: data.filter(p => p.saturationRate >= 120).length,
    saturated: data.filter(p => p.saturationRate >= 100 && p.saturationRate < 120).length,
    normal: data.filter(p => p.saturationRate >= 80 && p.saturationRate < 100).length,
    idle: data.filter(p => p.saturationRate < 80).length,
  }

  return (
    <div className="space-y-4">
      {/* 状态概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">过载人数</p>
                <p className="text-2xl font-semibold text-destructive">{statusCounts.overload}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">饱和人数</p>
                <p className="text-2xl font-semibold text-success">{statusCounts.saturated}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">正常人数</p>
                <p className="text-2xl font-semibold text-foreground">{statusCounts.normal}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">空闲人数</p>
                <p className="text-2xl font-semibold text-warning">{statusCounts.idle}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 数据表格 */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-foreground">人员工时明细</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">人员名称</TableHead>
                <TableHead className="text-muted-foreground">所属部门</TableHead>
                <TableHead className="text-muted-foreground text-right">总实际工时</TableHead>
                <TableHead className="text-muted-foreground text-right">总标准工时</TableHead>
                <TableHead className="text-muted-foreground text-right">饱和率</TableHead>
                <TableHead className="text-muted-foreground text-center">状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((person) => (
                <TableRow
                  key={person.id}
                  className="border-border hover:bg-muted/50"
                >
                  <TableCell className="font-medium text-foreground">{person.name}</TableCell>
                  <TableCell className="text-foreground">{person.department}</TableCell>
                  <TableCell className="text-right text-foreground">{person.totalActualHours}h</TableCell>
                  <TableCell className="text-right text-foreground">{person.totalStandardHours}h</TableCell>
                  <TableCell className={cn("text-right font-medium", getSaturationColor(person.saturationRate))}>
                    {person.saturationRate.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      person.saturationRate >= 120 && "bg-destructive/10 text-destructive",
                      person.saturationRate >= 100 && person.saturationRate < 120 && "bg-success/10 text-success",
                      person.saturationRate >= 80 && person.saturationRate < 100 && "bg-muted text-foreground",
                      person.saturationRate < 80 && "bg-warning/10 text-warning"
                    )}>
                      {getSaturationLabel(person.saturationRate)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {/* 汇总行 */}
              <TableRow className="border-border bg-muted/30 font-medium">
                <TableCell className="text-foreground font-semibold">合计</TableCell>
                <TableCell className="text-foreground">-</TableCell>
                <TableCell className="text-right text-foreground">{summary.totalActualHours.toLocaleString()}h</TableCell>
                <TableCell className="text-right text-foreground">{summary.totalStandardHours.toLocaleString()}h</TableCell>
                <TableCell className={cn("text-right", getSaturationColor(avgSaturationRate))}>
                  {avgSaturationRate.toFixed(1)}%
                </TableCell>
                <TableCell className="text-center">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 说明 */}
      <Card className="bg-card border-border">
        <CardContent className="py-4">
          <p className="text-sm font-medium text-foreground mb-2">饱和率说明</p>
          <div className="flex flex-wrap gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">过载（&gt;120%）</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success" />
              <span className="text-muted-foreground">饱和（100%-120%）</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-foreground" />
              <span className="text-muted-foreground">正常（80%-100%）</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-muted-foreground">空闲（&lt;80%）</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
