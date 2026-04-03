"use client"

import { useState } from "react"
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
import { ChevronRight, ChevronDown, User, FolderKanban } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProjectHierarchyData } from "@/lib/types"

interface ProjectViewProps {
  data: ProjectHierarchyData[]
}

function getSaturationColor(rate: number) {
  if (rate >= 120) return "text-destructive"
  if (rate >= 100) return "text-success"
  if (rate >= 80) return "text-foreground"
  return "text-warning"
}

function ProjectRow({
  item,
  expandedIds,
  toggleExpand,
  depth = 0,
}: {
  item: ProjectHierarchyData
  expandedIds: Set<string>
  toggleExpand: (id: string) => void
  depth?: number
}) {
  const isExpanded = expandedIds.has(item.id)
  const hasChildren = item.children && item.children.length > 0
  const isPerson = item.level === 2

  return (
    <>
      <TableRow className="border-border hover:bg-muted/50">
        <TableCell className="font-medium text-foreground">
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: `${depth * 24}px` }}
          >
            {hasChildren ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => toggleExpand(item.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-6" />
            )}
            {isPerson ? (
              <User className="h-4 w-4 text-muted-foreground" />
            ) : (
              <FolderKanban className="h-4 w-4 text-primary" />
            )}
            <span>{item.name}</span>
          </div>
        </TableCell>
        <TableCell className="text-right text-foreground">
          {isPerson ? "-" : item.memberCount}
        </TableCell>
        <TableCell className="text-right text-foreground">
          {item.totalActualHours.toLocaleString()}h
        </TableCell>
        <TableCell className="text-right text-foreground">
          {item.avgHours.toFixed(1)}h
        </TableCell>
        <TableCell className="text-right text-foreground">
          {item.totalStandardHours.toLocaleString()}h
        </TableCell>
        <TableCell className={cn("text-right font-medium", getSaturationColor(item.saturationRate))}>
          {item.saturationRate.toFixed(1)}%
        </TableCell>
      </TableRow>
      {isExpanded && hasChildren && item.children?.map((child) => (
        <ProjectRow
          key={child.id}
          item={child}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
          depth={depth + 1}
        />
      ))}
    </>
  )
}

export function ProjectView({ data }: ProjectViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAll = () => {
    const allIds = new Set<string>()
    data.forEach((item) => {
      if (item.children && item.children.length > 0) {
        allIds.add(item.id)
      }
    })
    setExpandedIds(allIds)
  }

  const collapseAll = () => {
    setExpandedIds(new Set())
  }

  // 计算汇总数据
  const summary = data.reduce(
    (acc, proj) => ({
      memberCount: acc.memberCount + proj.memberCount,
      totalActualHours: acc.totalActualHours + proj.totalActualHours,
      totalStandardHours: acc.totalStandardHours + proj.totalStandardHours,
    }),
    { memberCount: 0, totalActualHours: 0, totalStandardHours: 0 }
  )
  const avgHours = summary.memberCount > 0 ? summary.totalActualHours / summary.memberCount : 0
  const saturationRate = summary.totalStandardHours > 0 ? (summary.totalActualHours / summary.totalStandardHours) * 100 : 0

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium text-foreground">项目工时明细</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              全部展开
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              全部收起
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground min-w-[200px]">项目名称/人员</TableHead>
                <TableHead className="text-muted-foreground text-right">项目人数</TableHead>
                <TableHead className="text-muted-foreground text-right">总实际工时</TableHead>
                <TableHead className="text-muted-foreground text-right">人均工时</TableHead>
                <TableHead className="text-muted-foreground text-right">总标准工时</TableHead>
                <TableHead className="text-muted-foreground text-right">饱和率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((proj) => (
                <ProjectRow
                  key={proj.id}
                  item={proj}
                  expandedIds={expandedIds}
                  toggleExpand={toggleExpand}
                />
              ))}
              {/* 汇总行 */}
              <TableRow className="border-border bg-muted/30 font-medium">
                <TableCell className="text-foreground">
                  <div className="flex items-center gap-2 font-semibold">
                    <div className="w-6" />
                    合计
                  </div>
                </TableCell>
                <TableCell className="text-right text-foreground">{summary.memberCount}</TableCell>
                <TableCell className="text-right text-foreground">{summary.totalActualHours.toLocaleString()}h</TableCell>
                <TableCell className="text-right text-foreground">{avgHours.toFixed(1)}h</TableCell>
                <TableCell className="text-right text-foreground">{summary.totalStandardHours.toLocaleString()}h</TableCell>
                <TableCell className={cn("text-right", getSaturationColor(saturationRate))}>
                  {saturationRate.toFixed(1)}%
                </TableCell>
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
