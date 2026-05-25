import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { taskApi } from "../api/tasks";

const COLUMNS = [
  {
    key: "TODO",
    label: "Kutmoqda",
    color: "text-slate-400",
    bg: "bg-slate-800/50",
    border: "border-slate-700",
    dot: "bg-slate-500",
    count_bg: "bg-slate-700 text-slate-300",
  },
  {
    key: "IN_PROGRESS",
    label: "Jarayonda",
    color: "text-blue-400",
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
    count_bg: "bg-blue-500/20 text-blue-300",
  },
  {
    key: "DONE",
    label: "Bajarildi",
    color: "text-green-400",
    bg: "bg-green-500/5",
    border: "border-green-500/20",
    dot: "bg-green-500",
    count_bg: "bg-green-500/20 text-green-300",
  },
];

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const result = await taskApi.getAll();
      setTasks(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Vazifalarni yuklashda xato:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (editingTask) {
      const updatedTask = await taskApi.update(editingTask._id, formData);
      setTasks((prev) =>
        prev.map((t) =>
          t._id === editingTask._id ? { ...t, ...updatedTask } : t
        )
      );
    } else {
      const newTask = await taskApi.create(formData);
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" vazifasini o'chirmoqchimisiz?`)) return;
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("O'chirishda xato:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedTask = await taskApi.updateStatus(id, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, ...updatedTask } : t))
      );
    } catch (err) {
      console.error("Statusni o'zgartirishda xato:", err);
    }
  };

  const getColumnTasks = (status) =>
    tasks.filter(
      (t) => (t.status || "TODO").toUpperCase() === status.toUpperCase()
    );

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-xl font-bold">Mening vazifalarim</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Jami {tasks.length} ta vazifa
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Yangi vazifa
          </button>
        </div>

        {/* Kanban board */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLUMNS.map((col) => {
              const colTasks = getColumnTasks(col.key);
              return (
                <div
                  key={col.key}
                  className={`rounded-2xl border ${col.border} ${col.bg} p-4 min-h-400px`}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                      <span className={`font-semibold text-sm ${col.color}`}>
                        {col.label}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${col.count_bg}`}
                    >
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3">
                    {colTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-700">
                        <svg
                          className="w-10 h-10 mb-2 opacity-40"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <p className="text-xs">Vazifa yo'q</p>
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onEdit={handleOpenEdit}
                          onDelete={handleDelete}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editingTask={editingTask}
      />
    </div>
  );
};

export default Dashboard;
