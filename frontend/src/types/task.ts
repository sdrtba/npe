export type TaskStatus = 'pending' | 'in_progress' | 'complete'

export type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  categoryId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export type Category = {
  id: string
  name: string
  userId: string
  createdAt: string
  updatedAt: string
}

export type CategoryWithTasks = Category & {
  tasks: Task[]
}
