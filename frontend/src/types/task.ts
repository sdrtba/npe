export type Difficulty = 'easy' | 'medium' | 'hard'

export type Task = {
  id: string
  name: string
  difficulty: Difficulty
  base_score: string
  category: Category
  attachments: Attachment[]
  slug?: string
  author?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export type Category = {
  id: string
  name: string
  tasks_count?: string
}

export type Attachment = {
  id: string
  task_id: string
  filename: string
  download_url: string
  sha256: string
  created_at: string
}

export type CategoryWithTasks = Category & {
  tasks: Task[]
}
