const PRIORITY_STYLES = {
  HIGH: "bg-red-500/20 text-red-400 border-red-500/30",
  MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  LOW: "bg-green-500/20 text-green-400 border-green-500/30",
};

const PRIORITY_LABELS = { HIGH: "Yuqori", MEDIUM: "O'rta", LOW: "Past" };

const STATUS_NEXT = {
  TODO: {
    label: "Boshlash →",
    next: "IN_PROGRESS",
    style: "hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/50",
  },
  IN_PROGRESS: {
    label: "Tugatish ✓",
    next: "DONE",
    style:
      "hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/50",
  },
  DONE: {
    label: "← Qaytarish",
    next: "TODO",
    style:
      "hover:bg-slate-500/20 hover:text-slate-400 hover:border-slate-500/50",
  },
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isOverdue = (dateStr, status) => {
  if (!dateStr || status === "DONE") return false;
  return new Date(dateStr) < new Date();
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const currentStatus = (task.status || "TODO").toUpperCase();
  const nextStatus = STATUS_NEXT[currentStatus] || STATUS_NEXT.TODO;
  const overdue = isOverdue(task.dueDate, currentStatus);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/20 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-slate-100 font-semibold text-sm leading-snug flex-1 line-clamp-2">
          {task.title}
        </h3>
        <span
          className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${
            PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.MEDIUM
          }`}
        >
          {PRIORITY_LABELS[task.priority] || task.priority}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-slate-500 text-xs mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Due date */}
      {task.dueDate && (
        <div
          className={`flex items-center gap-1.5 text-xs mb-3 ${
            overdue ? "text-red-400" : "text-slate-500"
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {overdue && (
            <span className="text-red-400 font-medium">Muddati o'tgan! </span>
          )}
          {formatDate(task.dueDate)}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-700">
        {/* Status tugmasi */}
        <button
          onClick={() => onStatusChange(task._id, nextStatus.next)}
          className={`flex-1 text-xs py-1.5 px-2 rounded-lg border border-slate-600 text-slate-400 transition-all duration-200 font-medium ${nextStatus.style}`}
        >
          {nextStatus.label}
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg border border-slate-700 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200"
          title="Tahrirlash"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(task._id, task.title)}
          className="p-1.5 rounded-lg border border-slate-700 text-slate-500 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-200"
          title="O'chirish"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
