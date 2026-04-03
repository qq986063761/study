// 工时统计分析中心类型定义

export interface WorkHourRecord {
  id: string
  userId: string
  userName: string
  department: string
  projectId: string
  projectName: string
  taskId: string
  taskName: string
  taskType: string
  date: string
  hours: number
  isBillable: boolean
  isAbnormal: boolean
  abnormalType?: 'overtime' | 'undertime' | 'batch_submit' | 'missing'
}

export interface KPIData {
  totalHours: number
  totalHoursTrend: number
  avgHoursPerPerson: number
  avgHoursTrend: number
  avgStandardHours: number
  avgStandardHoursTrend: number
  submittedCount: number
  submittedTrend: number
  submissionRate: number
  submissionRateTrend: number
  saturationRate: number
  saturationRateTrend: number
}

export interface TrendDataPoint {
  date: string
  totalHours: number
  avgHours: number
  submittedCount: number
}

// 部门层级数据类型（支持树形展开）
export interface DepartmentHierarchyData {
  id: string
  name: string
  level: number // 1: 一级部门, 2: 二级部门, 3: 三级部门, 4: 人员
  parentId: string | null
  memberCount: number
  totalActualHours: number
  avgHours: number
  totalStandardHours: number
  saturationRate: number
  children?: DepartmentHierarchyData[]
  isExpanded?: boolean
}

export interface ProjectHierarchyData {
  id: string
  name: string
  level: number // 1: 项目, 2: 人员
  parentId: string | null
  memberCount: number
  totalActualHours: number
  avgHours: number
  totalStandardHours: number
  saturationRate: number
  children?: ProjectHierarchyData[]
  isExpanded?: boolean
}

export interface PersonData {
  id: string
  name: string
  department: string
  totalActualHours: number
  totalStandardHours: number
  saturationRate: number
}

export interface TaskData {
  id: string
  name: string
  projectName: string
  memberCount: number
  totalActualHours: number
}

export interface DetailRecord {
  id: string
  userName: string
  projectName: string
  taskName: string
  totalHours: number
  dailyHours: Record<string, number>
  isExpanded?: boolean
}

export interface FilterState {
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  granularity: 'day' | 'week' | 'month'
  departments: string[]
  projects: string[]
  members: string[]
  taskTypes: string[]
  isBillable: boolean | null
}
