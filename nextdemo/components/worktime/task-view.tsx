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
import type { TaskData } from "@/lib/types"

interface TaskViewProps {
  data: TaskData[]
}

export function TaskView({ data }: TaskViewProps) {
  // 计算汇总数据
  const summary = data.reduce(
    (acc, task) => ({
      memberCount: acc.memberCount + task.memberCount,
      totalActualHours: acc.totalActualHours + task.totalActualHours,
    }),
    { memberCount: 0, totalActualHours: 0 }
  )

  return (
    <div className="space-y-4">
      {/* 数据表格 */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-foreground">任务工时明细</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">任务名称</TableHead>
                <TableHead className="text-muted-foreground">所属项目</TableHead>
                <TableHead className="text-muted-foreground text-right">执行人数</TableHead>
                <TableHead className="text-muted-foreground text-right">总实际工时</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((task) => (
                <TableRow
                  key={task.id}
                  className="border-border hover:bg-muted/50"
                >
                  <TableCell className="font-medium text-foreground">{task.name}</TableCell>
                  <TableCell className="text-foreground">{task.projectName}</TableCell>
                  <TableCell className="text-right text-foreground">{task.memberCount}</TableCell>
                  <TableCell className="text-right text-foreground">{task.totalActualHours}h</TableCell>
                </TableRow>
              ))}
              {/* 汇总行 */}
              <TableRow className="border-border bg-muted/30 font-medium">
                <TableCell className="text-foreground font-semibold">合计</TableCell>
                <TableCell className="text-foreground">-</TableCell>
                <TableCell className="text-right text-foreground">{summary.memberCount}</TableCell>
                <TableCell className="text-right text-foreground">{summary.totalActualHours.toLocaleString()}h</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
