import type {
  KPIData,
  TrendDataPoint,
  DepartmentHierarchyData,
  ProjectHierarchyData,
  PersonData,
  TaskData,
  DetailRecord,
} from './types'

export const kpiData: KPIData = {
  totalHours: 12580,
  totalHoursTrend: 8.5,
  avgHoursPerPerson: 42.3,
  avgHoursTrend: 3.2,
  avgStandardHours: 40.0,
  avgStandardHoursTrend: 0,
  submittedCount: 298,
  submittedTrend: 12,
  submissionRate: 94.5,
  submissionRateTrend: 2.1,
  saturationRate: 105.8,
  saturationRateTrend: 3.2,
}

export const trendData: TrendDataPoint[] = [
  { date: '03-01', totalHours: 1850, avgHours: 6.2, submittedCount: 280 },
  { date: '03-02', totalHours: 1920, avgHours: 6.4, submittedCount: 285 },
  { date: '03-03', totalHours: 1780, avgHours: 5.9, submittedCount: 275 },
  { date: '03-04', totalHours: 2100, avgHours: 7.0, submittedCount: 292 },
  { date: '03-05', totalHours: 2050, avgHours: 6.8, submittedCount: 290 },
  { date: '03-06', totalHours: 1650, avgHours: 5.5, submittedCount: 260 },
  { date: '03-07', totalHours: 1230, avgHours: 4.1, submittedCount: 245 },
  { date: '03-08', totalHours: 1890, avgHours: 6.3, submittedCount: 282 },
  { date: '03-09', totalHours: 2010, avgHours: 6.7, submittedCount: 288 },
  { date: '03-10', totalHours: 1950, avgHours: 6.5, submittedCount: 286 },
  { date: '03-11', totalHours: 2150, avgHours: 7.2, submittedCount: 295 },
  { date: '03-12', totalHours: 2080, avgHours: 6.9, submittedCount: 291 },
  { date: '03-13', totalHours: 1720, avgHours: 5.7, submittedCount: 268 },
  { date: '03-14', totalHours: 1280, avgHours: 4.3, submittedCount: 248 },
]

// 部门层级数据（支持展开到人）
export const departmentHierarchyData: DepartmentHierarchyData[] = [
  {
    id: 'dept-1',
    name: '研发中心',
    level: 1,
    parentId: null,
    memberCount: 68,
    totalActualHours: 4850,
    avgHours: 71.3,
    totalStandardHours: 4480,
    saturationRate: 108.3,
    children: [
      {
        id: 'dept-1-1',
        name: '前端开发部',
        level: 2,
        parentId: 'dept-1',
        memberCount: 25,
        totalActualHours: 1820,
        avgHours: 72.8,
        totalStandardHours: 1640,
        saturationRate: 111.0,
        children: [
          {
            id: 'dept-1-1-1',
            name: 'Web团队',
            level: 3,
            parentId: 'dept-1-1',
            memberCount: 15,
            totalActualHours: 1120,
            avgHours: 74.7,
            totalStandardHours: 984,
            saturationRate: 113.8,
            children: [
              { id: 'person-1', name: '张伟', level: 4, parentId: 'dept-1-1-1', memberCount: 1, totalActualHours: 85, avgHours: 85, totalStandardHours: 66, saturationRate: 128.8 },
              { id: 'person-2', name: '李明', level: 4, parentId: 'dept-1-1-1', memberCount: 1, totalActualHours: 78, avgHours: 78, totalStandardHours: 66, saturationRate: 118.2 },
              { id: 'person-3', name: '王芳', level: 4, parentId: 'dept-1-1-1', memberCount: 1, totalActualHours: 72, avgHours: 72, totalStandardHours: 66, saturationRate: 109.1 },
            ]
          },
          {
            id: 'dept-1-1-2',
            name: '移动端团队',
            level: 3,
            parentId: 'dept-1-1',
            memberCount: 10,
            totalActualHours: 700,
            avgHours: 70.0,
            totalStandardHours: 656,
            saturationRate: 106.7,
            children: [
              { id: 'person-4', name: '刘洋', level: 4, parentId: 'dept-1-1-2', memberCount: 1, totalActualHours: 75, avgHours: 75, totalStandardHours: 66, saturationRate: 113.6 },
              { id: 'person-5', name: '陈静', level: 4, parentId: 'dept-1-1-2', memberCount: 1, totalActualHours: 68, avgHours: 68, totalStandardHours: 66, saturationRate: 103.0 },
            ]
          }
        ]
      },
      {
        id: 'dept-1-2',
        name: '后端开发部',
        level: 2,
        parentId: 'dept-1',
        memberCount: 28,
        totalActualHours: 1980,
        avgHours: 70.7,
        totalStandardHours: 1840,
        saturationRate: 107.6,
        children: [
          {
            id: 'dept-1-2-1',
            name: 'Java组',
            level: 3,
            parentId: 'dept-1-2',
            memberCount: 18,
            totalActualHours: 1280,
            avgHours: 71.1,
            totalStandardHours: 1180,
            saturationRate: 108.5,
            children: [
              { id: 'person-6', name: '赵强', level: 4, parentId: 'dept-1-2-1', memberCount: 1, totalActualHours: 82, avgHours: 82, totalStandardHours: 66, saturationRate: 124.2 },
              { id: 'person-7', name: '孙丽', level: 4, parentId: 'dept-1-2-1', memberCount: 1, totalActualHours: 76, avgHours: 76, totalStandardHours: 66, saturationRate: 115.2 },
            ]
          }
        ]
      },
      {
        id: 'dept-1-3',
        name: '测试部',
        level: 2,
        parentId: 'dept-1',
        memberCount: 15,
        totalActualHours: 1050,
        avgHours: 70.0,
        totalStandardHours: 984,
        saturationRate: 106.7
      }
    ]
  },
  {
    id: 'dept-2',
    name: '产品中心',
    level: 1,
    parentId: null,
    memberCount: 35,
    totalActualHours: 2680,
    avgHours: 76.6,
    totalStandardHours: 2296,
    saturationRate: 116.7,
    children: [
      {
        id: 'dept-2-1',
        name: '产品规划部',
        level: 2,
        parentId: 'dept-2',
        memberCount: 20,
        totalActualHours: 1580,
        avgHours: 79.0,
        totalStandardHours: 1312,
        saturationRate: 120.4
      },
      {
        id: 'dept-2-2',
        name: '用户研究部',
        level: 2,
        parentId: 'dept-2',
        memberCount: 15,
        totalActualHours: 1100,
        avgHours: 73.3,
        totalStandardHours: 984,
        saturationRate: 111.8
      }
    ]
  },
  {
    id: 'dept-3',
    name: '设计中心',
    level: 1,
    parentId: null,
    memberCount: 28,
    totalActualHours: 1920,
    avgHours: 68.6,
    totalStandardHours: 1838,
    saturationRate: 104.5
  },
  {
    id: 'dept-4',
    name: '市场中心',
    level: 1,
    parentId: null,
    memberCount: 25,
    totalActualHours: 1580,
    avgHours: 63.2,
    totalStandardHours: 1640,
    saturationRate: 96.3
  },
  {
    id: 'dept-5',
    name: '运营中心',
    level: 1,
    parentId: null,
    memberCount: 22,
    totalActualHours: 1050,
    avgHours: 47.7,
    totalStandardHours: 1444,
    saturationRate: 72.7
  },
]

// 项目层级数据（支持展开到人）
export const projectHierarchyData: ProjectHierarchyData[] = [
  {
    id: 'proj-1',
    name: 'CRM系统升级',
    level: 1,
    parentId: null,
    memberCount: 18,
    totalActualHours: 2850,
    avgHours: 158.3,
    totalStandardHours: 2376,
    saturationRate: 120.0,
    children: [
      { id: 'proj-1-p1', name: '张伟', level: 2, parentId: 'proj-1', memberCount: 1, totalActualHours: 185, avgHours: 185, totalStandardHours: 132, saturationRate: 140.2 },
      { id: 'proj-1-p2', name: '李明', level: 2, parentId: 'proj-1', memberCount: 1, totalActualHours: 172, avgHours: 172, totalStandardHours: 132, saturationRate: 130.3 },
      { id: 'proj-1-p3', name: '王芳', level: 2, parentId: 'proj-1', memberCount: 1, totalActualHours: 165, avgHours: 165, totalStandardHours: 132, saturationRate: 125.0 },
      { id: 'proj-1-p4', name: '刘洋', level: 2, parentId: 'proj-1', memberCount: 1, totalActualHours: 158, avgHours: 158, totalStandardHours: 132, saturationRate: 119.7 },
      { id: 'proj-1-p5', name: '陈静', level: 2, parentId: 'proj-1', memberCount: 1, totalActualHours: 152, avgHours: 152, totalStandardHours: 132, saturationRate: 115.2 },
    ]
  },
  {
    id: 'proj-2',
    name: '移动端App开发',
    level: 1,
    parentId: null,
    memberCount: 15,
    totalActualHours: 2420,
    avgHours: 161.3,
    totalStandardHours: 1980,
    saturationRate: 122.2,
    children: [
      { id: 'proj-2-p1', name: '赵强', level: 2, parentId: 'proj-2', memberCount: 1, totalActualHours: 178, avgHours: 178, totalStandardHours: 132, saturationRate: 134.8 },
      { id: 'proj-2-p2', name: '孙丽', level: 2, parentId: 'proj-2', memberCount: 1, totalActualHours: 168, avgHours: 168, totalStandardHours: 132, saturationRate: 127.3 },
    ]
  },
  {
    id: 'proj-3',
    name: '数据中台建设',
    level: 1,
    parentId: null,
    memberCount: 12,
    totalActualHours: 1980,
    avgHours: 165.0,
    totalStandardHours: 1584,
    saturationRate: 125.0
  },
  {
    id: 'proj-4',
    name: '官网改版',
    level: 1,
    parentId: null,
    memberCount: 10,
    totalActualHours: 1560,
    avgHours: 156.0,
    totalStandardHours: 1320,
    saturationRate: 118.2
  },
  {
    id: 'proj-5',
    name: '内部工具优化',
    level: 1,
    parentId: null,
    memberCount: 8,
    totalActualHours: 1280,
    avgHours: 160.0,
    totalStandardHours: 1056,
    saturationRate: 121.2
  },
  {
    id: 'proj-6',
    name: '客服系统',
    level: 1,
    parentId: null,
    memberCount: 7,
    totalActualHours: 980,
    avgHours: 140.0,
    totalStandardHours: 924,
    saturationRate: 106.1
  },
  {
    id: 'proj-7',
    name: '营销平台',
    level: 1,
    parentId: null,
    memberCount: 6,
    totalActualHours: 860,
    avgHours: 143.3,
    totalStandardHours: 792,
    saturationRate: 108.6
  },
  {
    id: 'proj-8',
    name: '数据报表',
    level: 1,
    parentId: null,
    memberCount: 5,
    totalActualHours: 650,
    avgHours: 130.0,
    totalStandardHours: 660,
    saturationRate: 98.5
  },
]

// 人员视角数据
export const personData: PersonData[] = [
  { id: '1', name: '张伟', department: '研发中心/前端开发部', totalActualHours: 185, totalStandardHours: 132, saturationRate: 140.2 },
  { id: '2', name: '赵强', department: '研发中心/后端开发部', totalActualHours: 178, totalStandardHours: 132, saturationRate: 134.8 },
  { id: '3', name: '李明', department: '研发中心/前端开发部', totalActualHours: 172, totalStandardHours: 132, saturationRate: 130.3 },
  { id: '4', name: '孙丽', department: '研发中心/后端开发部', totalActualHours: 168, totalStandardHours: 132, saturationRate: 127.3 },
  { id: '5', name: '王芳', department: '研发中心/前端开发部', totalActualHours: 165, totalStandardHours: 132, saturationRate: 125.0 },
  { id: '6', name: '刘洋', department: '研发中心/测试部', totalActualHours: 158, totalStandardHours: 132, saturationRate: 119.7 },
  { id: '7', name: '陈静', department: '产品中心/产品规划部', totalActualHours: 152, totalStandardHours: 132, saturationRate: 115.2 },
  { id: '8', name: '周鹏', department: '设计中心', totalActualHours: 128, totalStandardHours: 132, saturationRate: 97.0 },
  { id: '9', name: '吴芳', department: '市场中心', totalActualHours: 118, totalStandardHours: 132, saturationRate: 89.4 },
  { id: '10', name: '郑凯', department: '运营中心', totalActualHours: 98, totalStandardHours: 132, saturationRate: 74.2 },
]

// 任务视角数据
export const taskData: TaskData[] = [
  { id: '1', name: '后端API开发', projectName: 'CRM系统升级', memberCount: 6, totalActualHours: 580 },
  { id: '2', name: '前端页面开发', projectName: '移动端App开发', memberCount: 5, totalActualHours: 520 },
  { id: '3', name: '需求分析', projectName: '数据中台建设', memberCount: 4, totalActualHours: 380 },
  { id: '4', name: 'UI设计', projectName: '官网改版', memberCount: 3, totalActualHours: 320 },
  { id: '5', name: '测试验收', projectName: 'CRM系统升级', memberCount: 4, totalActualHours: 280 },
  { id: '6', name: '文档编写', projectName: '内部工具优化', memberCount: 3, totalActualHours: 220 },
  { id: '7', name: '项目会议', projectName: '多项目', memberCount: 25, totalActualHours: 450 },
  { id: '8', name: '技术调研', projectName: '数据中台建设', memberCount: 4, totalActualHours: 180 },
  { id: '9', name: '代码审查', projectName: 'CRM系统升级', memberCount: 8, totalActualHours: 160 },
  { id: '10', name: '部署上线', projectName: '官网改版', memberCount: 3, totalActualHours: 120 },
]

export const taskTypeDistribution = [
  { name: '开发', value: 4200, fill: 'var(--chart-1)' },
  { name: '设计', value: 1850, fill: 'var(--chart-2)' },
  { name: '测试', value: 1280, fill: 'var(--chart-3)' },
  { name: '会议', value: 980, fill: 'var(--chart-4)' },
  { name: '其他', value: 720, fill: 'var(--chart-5)' },
]

export const detailRecords: DetailRecord[] = [
  {
    id: '1',
    userName: '张伟',
    projectName: 'CRM系统升级',
    taskName: '后端API开发',
    totalHours: 45.5,
    dailyHours: { '03-01': 8, '03-02': 8.5, '03-03': 7, '03-04': 9, '03-05': 8, '03-06': 5 },
  },
  {
    id: '2',
    userName: '李娜',
    projectName: '移动端App开发',
    taskName: '前端页面开发',
    totalHours: 42,
    dailyHours: { '03-01': 7.5, '03-02': 8, '03-03': 6.5, '03-04': 8, '03-05': 7.5, '03-06': 4.5 },
  },
  {
    id: '3',
    userName: '王强',
    projectName: '数据中台建设',
    taskName: '需求分析',
    totalHours: 38,
    dailyHours: { '03-01': 6, '03-02': 7, '03-03': 6.5, '03-04': 7.5, '03-05': 6, '03-06': 5 },
  },
  {
    id: '4',
    userName: '刘洋',
    projectName: '官网改版',
    taskName: 'UI设计',
    totalHours: 35.5,
    dailyHours: { '03-01': 6.5, '03-02': 6, '03-03': 5.5, '03-04': 7, '03-05': 6.5, '03-06': 4 },
  },
  {
    id: '5',
    userName: '陈明',
    projectName: 'CRM系统升级',
    taskName: '测试验收',
    totalHours: 32,
    dailyHours: { '03-01': 5.5, '03-02': 6, '03-03': 5, '03-04': 6, '03-05': 5.5, '03-06': 4 },
  },
]

export const departments = ['研发中心', '产品中心', '设计中心', '市场中心', '运营中心']
export const projects = ['CRM系统升级', '移动端App开发', '数据中台建设', '官网改版', '内部工具优化', '客服系统', '营销平台', '数据报表']
export const members = ['张伟', '李明', '王芳', '刘洋', '陈静', '赵强', '孙丽', '周鹏', '吴芳', '郑凯']
export const taskTypes = ['开发', '设计', '测试', '会议', '调研', '文档', '分析', '其他']
