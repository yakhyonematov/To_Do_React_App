import { useState, useEffect } from "react";

const INITIAL_FORM = {
  title: "",
  description: "",
  priority: "MEDIUM",
  dueDate: "",
};

const TaskModal = ({ isOpen, onClose, onSave, editingTask }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        priority: editingTask.priority || "MEDIUM",
        dueDate: editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
    setSaveError("");
  }, [editingTask, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Sarlavha majburiy";
    return newErrors;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    setSaveError("");
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate || null,
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error("Saqlashda xato:", err);
      setSaveError(
        err?.response?.data?.message ||
          "Xatolik yuz berdi. Qayta urinib ko'ring."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md animate-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <h2 className="text-white font-bold text-lg">
            {editingTask ? "Vazifani tahrirlash" : "Yangi vazifa"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Save error */}
          {saveError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {saveError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1.5">
              Sarlavha <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                setErrors({ ...errors, title: "" });
              }}
              placeholder="Vazifa nomi..."
              className={`w-full bg-slate-800 border ${
                errors.title ? "border-red-500" : "border-slate-700"
              } rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors`}
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1.5">
              Tavsif
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Qo'shimcha izoh (ixtiyoriy)..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1.5">
              Muhimlik darajasi
            </label>
            <div className="flex gap-2">
              {[
                {
                  value: "LOW",
                  label: "Oz",
                  style: "border-green-500/50 bg-green-500/10 text-green-400",
                },
                {
                  value: "MEDIUM",
                  label: "O'rta",
                  style:
                    "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
                },
                {
                  value: "HIGH",
                  label: "Yuqori",
                  style: "border-red-500/50 bg-red-500/10 text-red-400",
                },
              ].map(({ value, label, style }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, priority: value })}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    form.priority === value
                      ? style
                      : "border-slate-700 text-slate-500 hover:border-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1.5">
              Muddat
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 border-t border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-medium transition-all"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-all"
          >
            {loading ? "Saqlanmoqda..." : editingTask ? "Saqlash" : "Yaratish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
