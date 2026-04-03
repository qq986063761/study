"use client"

import { useState } from "react"
import { CalendarIcon, Filter, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { departments, projects, taskTypes } from "@/lib/mock-data"
import type { FilterState } from "@/lib/types"

interface FilterSectionProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function FilterSection({ filters, onFiltersChange }: FilterSectionProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleDateChange = (range: { from?: Date; to?: Date } | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        from: range?.from,
        to: range?.to,
      },
    })
  }

  const handleGranularityChange = (value: string) => {
    onFiltersChange({
      ...filters,
      granularity: value as FilterState['granularity'],
    })
  }

  const handleDepartmentChange = (value: string) => {
    const newDepts = filters.departments.includes(value)
      ? filters.departments.filter(d => d !== value)
      : [...filters.departments, value]
    onFiltersChange({ ...filters, departments: newDepts })
  }

  const handleProjectChange = (value: string) => {
    const newProjects = filters.projects.includes(value)
      ? filters.projects.filter(p => p !== value)
      : [...filters.projects, value]
    onFiltersChange({ ...filters, projects: newProjects })
  }

  const activeFiltersCount = 
    filters.departments.length + 
    filters.projects.length + 
    filters.taskTypes.length +
    (filters.isBillable !== null ? 1 : 0)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* 时间范围 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-secondary border-border hover:bg-muted",
                !filters.dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "MM/dd", { locale: zhCN })} -{" "}
                    {format(filters.dateRange.to, "MM/dd", { locale: zhCN })}
                  </>
                ) : (
                  format(filters.dateRange.from, "yyyy/MM/dd", { locale: zhCN })
                )
              ) : (
                <span>选择日期范围</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange.from}
              selected={{
                from: filters.dateRange.from,
                to: filters.dateRange.to,
              }}
              onSelect={handleDateChange}
              numberOfMonths={2}
              locale={zhCN}
            />
          </PopoverContent>
        </Popover>

        {/* 快捷时间选择 */}
        <div className="flex gap-1">
          {['今天', '本周', '本月'].map((label) => (
            <Button
              key={label}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* 统计粒度 */}
        <Select value={filters.granularity} onValueChange={handleGranularityChange}>
          <SelectTrigger className="w-24 bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">按天</SelectItem>
            <SelectItem value="week">按周</SelectItem>
            <SelectItem value="month">按月</SelectItem>
          </SelectContent>
        </Select>

        {/* 部门筛选 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-secondary border-border hover:bg-muted">
              部门
              {filters.departments.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                  {filters.departments.length}
                </Badge>
              )}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <div className="space-y-1">
              {departments.map((dept) => (
                <button
                  key={dept}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    filters.departments.includes(dept)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={() => handleDepartmentChange(dept)}
                >
                  {dept}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* 项目筛选 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-secondary border-border hover:bg-muted">
              项目
              {filters.projects.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                  {filters.projects.length}
                </Badge>
              )}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {projects.map((project) => (
                <button
                  key={project}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    filters.projects.includes(project)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={() => handleProjectChange(project)}
                >
                  {project}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* 更多筛选 */}
        <Button
          variant="outline"
          className="bg-secondary border-border hover:bg-muted"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter className="mr-2 h-4 w-4" />
          更多筛选
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* 重置按钮 */}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => onFiltersChange({
            dateRange: { from: undefined, to: undefined },
            granularity: 'day',
            departments: [],
            projects: [],
            members: [],
            taskTypes: [],
            isBillable: null,
          })}
        >
          重置
        </Button>
      </div>

      {/* 高级筛选 */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-3">
            <Select>
              <SelectTrigger className="w-32 bg-secondary border-border">
                <SelectValue placeholder="任务类型" />
              </SelectTrigger>
              <SelectContent>
                {taskTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32 bg-secondary border-border">
                <SelectValue placeholder="计费类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="billable">计费工时</SelectItem>
                <SelectItem value="non-billable">非计费工时</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
