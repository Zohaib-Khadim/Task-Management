import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Task {
    id: number;
    title: string;
    description?: string | null;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    assignee_id?: number | null;
    due_date?: string | null;
    attachment_url?: string | null;
    created_at: string;
    updated_at: string;
}

export interface TaskInput {
    title: string;
    description?: string;
    status?: 'todo' | 'in_progress' | 'done';
    priority?: 'low' | 'medium' | 'high';
    assignee_id?: number;
    due_date?: string;
}

export const useTasks = () => {
    const queryClient = useQueryClient();
    const token = localStorage.getItem('token');

    const tasksQuery = useQuery<Task[], Error>({
        queryKey: ['tasks'],
        queryFn: async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } });
                const data = response.data as Task[];
                console.log('Tasks data:', data);
                if (!Array.isArray(data)) throw new Error('API returned non-array data');
                return data;
            } catch (error) {
                console.error('API error for tasks:', error);
                return []; // Fallback to empty array on error
            }
        },
        enabled: !!token,
        initialData: [],
    });

    const addTaskMutation = useMutation<Task, Error, { data: TaskInput; file?: File | null }>({
        mutationFn: ({ data, file }) => {
            const formData = new FormData();
            formData.append('title', data.title);
            if (data.description) formData.append('description', data.description);
            formData.append('status', data.status || 'todo');
            formData.append('priority', data.priority || 'medium');
            if (data.assignee_id) formData.append('assignee_id', data.assignee_id.toString());
            if (data.due_date) formData.append('due_date', data.due_date);
            if (file) formData.append('file', file);

            return axios
                .post('http://localhost:5000/api/tasks', formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
                })
                .then((res) => res.data as Task);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const updateTaskMutation = useMutation<Task, Error, { id: number; data: Partial<TaskInput>; file?: File | null }>({
        mutationFn: ({ id, data, file }) => {
            const formData = new FormData();
            if (data.title) formData.append('title', data.title);
            if (data.description) formData.append('description', data.description);
            if (data.status) formData.append('status', data.status);
            if (data.priority) formData.append('priority', data.priority);
            if (data.assignee_id) formData.append('assignee_id', data.assignee_id.toString());
            if (data.due_date) formData.append('due_date', data.due_date);
            if (file) formData.append('file', file);

            return axios
                .put(`http://localhost:5000/api/tasks/${id}`, formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
                })
                .then((res) => res.data as Task);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const uploadFileMutation = useMutation<{ attachment_url: string }, Error, { taskId: number; file: File }>({
        mutationFn: ({ taskId, file }) => {
            const formData = new FormData();
            formData.append('file', file);
            return axios
                .post(`http://localhost:5000/api/tasks/${taskId}/upload`, formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
                })
                .then((res) => res.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const deleteTaskMutation = useMutation<void, Error, { id: number }>({
        mutationFn: ({ id }) =>
            axios
                .delete(`http://localhost:5000/api/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const endTaskMutation = useMutation<Task, Error, { taskId: number }>({
        mutationFn: ({ taskId }) =>
            axios
                .post(`http://localhost:5000/api/tasks/${taskId}/end`, {}, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => res.data.task as Task),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    return {
        tasks: tasksQuery.data || [], // Ensure tasks is always an array
        addTaskMutation,
        updateTaskMutation,
        uploadFileMutation,
        deleteTaskMutation,
        endTaskMutation,
        isLoading: tasksQuery.isLoading,
    };
};