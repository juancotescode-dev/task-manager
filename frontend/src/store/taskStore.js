import { create } from 'zustand';
import api from '../api/axios';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  stats: null,
  filters: { status: '', priority: '', search: '' },
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    const { filters } = get();
    const params = new URLSearchParams();
    if (filters.status)   params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search)   params.append('search', filters.search);
    const { data } = await api.get(`/tasks?${params}`);
    set({ tasks: data, loading: false });
  },

  fetchStats: async () => {
    const { data } = await api.get('/tasks/stats');
    set({ stats: data });
  },

  createTask: async (task) => {
    const { data } = await api.post('/tasks', task);
    set(s => ({ tasks: [data, ...s.tasks] }));
    get().fetchStats();
  },

  updateTask: async (id, updates) => {
    const { data } = await api.patch(`/tasks/${id}`, updates);
    set(s => ({ tasks: s.tasks.map(t => t.id === id ? data : t) }));
    get().fetchStats();
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
    get().fetchStats();
  },

  setFilter: (key, value) => {
    set(s => ({ filters: { ...s.filters, [key]: value } }));
    get().fetchTasks();
  },
}));