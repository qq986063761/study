"use client"

import { useState, Fragment } from "react"
import { ChevronDown, ChevronRight, Download, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { DetailRecord } from "@/lib/types"

interface DetailTableProps {
  data: DetailRecord[]
}

export function DetailTable({ data }: DetailTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  // 获取所有日期列
  const allDates = Array.from(
    new Set(data.flatMap((r) => Object.keys(r.dailyHours)))
  ).sort()

  const isAbnormal = (hours: number) => hours > 10 || hours < 2

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-foreground">工时明细</CardTitle>
        <Button variant="outline" size="sm" className="bg-secondary border-border hover:bg-muted">
          <Download className="mr-2 h-4 w-4" />
          导出Excel
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground w-10"></TableHead>
                <TableHead className="text-muted-foreground sticky left-0 bg-card z-10">人员</TableHead>
                <TableHead className="text-muted-foreground">项目</TableHead>
                <TableHead className="text-muted-foreground">任务</TableHead>
                <TableHead className="text-muted-foreground text-right">总工时</TableHead>
                {allDates.map((date) => (
                  <TableHead key={date} className="text-muted-foreground text-center min-w-[60px]">
                    {date}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record) => (
                <Fragment key={record.id}>
                  <TableRow
                    className="border-border hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleRow(record.id)}
                  >
                    <TableCell className="w-10">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        {expandedRows.has(record.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium text-foreground sticky left-0 bg-card">
                      {record.userName}
                    </TableCell>
                    <TableCell className="text-foreground">{record.projectName}</TableCell>
                    <TableCell className="text-foreground">{record.taskName}</TableCell>
                    <TableCell className="text-right text-foreground font-medium">
                      {record.totalHours}h
                    </TableCell>
                    {allDates.map((date) => {
                      const hours = record.dailyHours[date]
                      const abnormal = hours && isAbnormal(hours)
                      return (
                        <TableCell
                          key={date}
                          className={cn(
                            "text-center",
                            abnormal ? "text-destructive" : "text-foreground"
                          )}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {hours !== undefined ? `${hours}h` : '-'}
                            {abnormal && <AlertTriangle className="h-3 w-3" />}
                          </div>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                  {expandedRows.has(record.id) && (
                    <TableRow className="border-border bg-secondary/50">
                      <TableCell colSpan={5 + allDates.length} className="py-4 px-8">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">详细工时记录</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {allDates.map((date) => {
                              const hours = record.dailyHours[date]
                              return (
                                <div
                                  key={date}
                                  className={cn(
                                    "p-3 rounded-lg text-center",
                                    hours && isAbnormal(hours)
                                      ? "bg-destructive/10 border border-destructive/30"
                                      : "bg-card border border-border"
                                  )}
                                >
                                  <p className="text-xs text-muted-foreground">{date}</p>
                                  <p className={cn(
                                    "text-lg font-medium mt-1",
                                    hours && isAbnormal(hours) ? "text-destructive" : "text-foreground"
                                  )}>
                                    {hours !== undefined ? `${hours}h` : '-'}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* 图例说明 */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-destructive" />
            <span>异常工时（单日 &gt;10h 或 &lt;2h）</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
