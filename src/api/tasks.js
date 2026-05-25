import api from "./axios";

export const taskApi = {
  getAll: async () => {
    const { data } = await api.get("/tasks");
    return data.data || data.tasks || data;
  },

  create: async (taskData) => {
    const { data } = await api.post("/tasks", taskData);
    return data.data || data.task || data;
  },

  update: async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data.data || data.task || data;
  },

  delete: async (id) => {
    await api.delete(`/tasks/${id}`);
  },

  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/tasks/${id}/status`, { status });
    return data.data || data.task || data;
  },
};
