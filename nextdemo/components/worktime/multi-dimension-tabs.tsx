"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, FolderKanban, Users, ListTodo } from "lucide-react"
import { DepartmentView } from "./department-view"
import { ProjectView } from "./project-view"
import { PersonView } from "./person-view"
import { TaskView } from "./task-view"
import type { DepartmentHierarchyData, ProjectHierarchyData, PersonData, TaskData } from "@/lib/types"

interface MultiDimensionTabsProps {
  departmentData: DepartmentHierarchyData[]
  projectData: ProjectHierarchyData[]
  personData: PersonData[]
  taskData: TaskData[]
}

export function MultiDimensionTabs({
  departmentData,
  projectData,
  personData,
  taskData,
}: MultiDimensionTabsProps) {
  return (
    <Tabs defaultValue="department" className="w-full">
      <TabsList className="bg-secondary w-full justify-start h-auto flex-wrap gap-1 p-1">
        <TabsTrigger
          value="department"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
        >
          <Building2 className="h-4 w-4" />
          部门视角
        </TabsTrigger>
        <TabsTrigger
          value="project"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
        >
          <FolderKanban className="h-4 w-4" />
          项目视角
        </TabsTrigger>
        <TabsTrigger
          value="person"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          人员视角
        </TabsTrigger>
        <TabsTrigger
          value="task"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
        >
          <ListTodo className="h-4 w-4" />
          任务视角
        </TabsTrigger>
      </TabsList>

      <TabsContent value="department" className="mt-4">
        <DepartmentView data={departmentData} />
      </TabsContent>

      <TabsContent value="project" className="mt-4">
        <ProjectView data={projectData} />
      </TabsContent>

      <TabsContent value="person" className="mt-4">
        <PersonView data={personData} />
      </TabsContent>

      <TabsContent value="task" className="mt-4">
        <TaskView data={taskData} />
      </TabsContent>
    </Tabs>
  )
}
