"use client"

import { useState } from "react"
import { Clock, BarChart3, Settings, Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FilterSection } from "@/components/worktime/filter-section"
import { KPICards } from "@/components/worktime/kpi-cards"
import { TrendChart } from "@/components/worktime/trend-chart"
import { MultiDimensionTabs } from "@/components/worktime/multi-dimension-tabs"
import { DetailTable } from "@/components/worktime/detail-table"
import { BreadcrumbNav } from "@/components/worktime/breadcrumb-nav"
import {
  kpiData,
  trendData,
  departmentHierarchyData,
  projectHierarchyData,
  personData,
  taskData,
  detailRecords,
} from "@/lib/mock-data"
import type { FilterState } from "@/lib/types"

export default function WorktimeAnalysisPage() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: undefined, to: undefined },
    granularity: 'day',
    departments: [],
    projects: [],
    members: [],
    taskTypes: [],
    isBillable: null,
  })

  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: "公司", onClick: () => setBreadcrumbs([{ label: "公司", onClick: () => {} }]) },
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">WorkTime</span>
            </div>

            {/* 导航菜单 */}
            <nav className="hidden md:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    数据分析
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    工时分析中心
                  </DropdownMenuItem>
                  <DropdownMenuItem>项目成本分析</DropdownMenuItem>
                  <DropdownMenuItem>人效分析报告</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                工时填报
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                项目管理
              </Button>
            </nav>
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">管</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* 页面标题和面包屑 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-foreground">工时分析中心</h1>
              <BreadcrumbNav items={breadcrumbs} />
            </div>
            <p className="text-sm text-muted-foreground">
              全面分析公司工时投入，支持多维度下钻，辅助管理决策
            </p>
          </div>

          {/* 筛选区 */}
          <FilterSection filters={filters} onFiltersChange={setFilters} />

          {/* KPI指标区 */}
          <KPICards data={kpiData} />

          {/* 趋势分析区 */}
          <TrendChart data={trendData} />

          {/* 多维分析区 */}
          <section>
            <h2 className="text-lg font-medium text-foreground mb-4">多维分析</h2>
            <MultiDimensionTabs
              departmentData={departmentHierarchyData}
              projectData={projectHierarchyData}
              personData={personData}
              taskData={taskData}
            />
          </section>

          {/* 明细数据区 */}
          <section>
            <h2 className="text-lg font-medium text-foreground mb-4">工时明细</h2>
            <DetailTable data={detailRecords} />
          </section>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-border bg-card py-4 mt-8">
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
          <p>© 2024 WorkTime 工时管理系统</p>
          <p>数据更新时间：2024-03-14 18:30</p>
        </div>
      </footer>
    </div>
  )
}
