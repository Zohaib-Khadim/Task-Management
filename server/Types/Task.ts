export interface Task {
    id: number;
    title: string;
    description?: string | null;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    assignee_id?: number | null;
    due_date?: string | null; // Stored as DATE in MySQL, returned as string
    attachment_url?: string | null;
    created_at: string; // Timestamp from MySQL
    updated_at: string; // Timestamp from MySQL
  }
  
  export let tasks: Task[] = [];
  let taskIdCounter = 1;