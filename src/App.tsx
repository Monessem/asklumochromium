import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Check,
  Trash2,
  Clock,
  Zap,
  Settings,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Calendar,
  Star,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

type FilterType = "all" | "todo" | "in-progress" | "done";
type SortType = "newest" | "priority" | "dueDate";

// Check if running as extension
const isExtension = typeof chrome !== "undefined" && chrome.runtime?.id;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("medium");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [darkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load tasks
  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      if (isExtension) {
        const response = await chrome.runtime.sendMessage({ type: "GET_TASKS" });
        setTasks(response.tasks || []);
      } else {
        // Fallback to localStorage for web preview
        const saved = localStorage.getItem("projectflow-tasks");
        if (saved) setTasks(JSON.parse(saved));
      }
    } catch {
      const saved = localStorage.getItem("projectflow-tasks");
      if (saved) setTasks(JSON.parse(saved));
    }
    setLoading(false);
  }

  async function saveTasks(newTasks: Task[]) {
    setTasks(newTasks);
    try {
      if (isExtension) {
        await chrome.storage.local.set({ tasks: newTasks });
      } else {
        localStorage.setItem("projectflow-tasks", JSON.stringify(newTasks));
      }
    } catch {
      localStorage.setItem("projectflow-tasks", JSON.stringify(newTasks));
    }
  }

  async function addTask() {
    if (!newTaskTitle.trim()) return;

    const task: Task = {
      id: uuidv4(),
      title: newTaskTitle.trim(),
      description: "",
      priority: newTaskPriority,
      status: "todo",
      dueDate: null,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newTasks = [...tasks, task];
    saveTasks(newTasks);
    setNewTaskTitle("");
    setNewTaskPriority("medium");
    setShowAddForm(false);
  }

  async function toggleTask(taskId: string) {
    const newTasks = tasks.map((t) => {
      if (t.id === taskId) {
        const newStatus = t.status === "done" ? "todo" : "done";
        return { ...t, status: newStatus as Task["status"], updatedAt: new Date().toISOString() };
      }
      return t;
    });
    saveTasks(newTasks);
  }

  async function deleteTask(taskId: string) {
    const newTasks = tasks.filter((t) => t.id !== taskId);
    saveTasks(newTasks);
  }

  async function updateTaskStatus(taskId: string, status: Task["status"]) {
    const newTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
    );
    saveTasks(newTasks);
  }

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((t) => {
      if (filter !== "all" && t.status !== filter) return false;
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
    highPriority: tasks.filter((t) => t.priority === "high" && t.status !== "done").length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="w-[380px] h-[520px] bg-gray-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div
      className="w-[380px] h-[520px] bg-gray-950 text-white flex flex-col overflow-hidden"
      dir="rtl"
      style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-l from-violet-600 to-indigo-600 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <h1 className="text-sm font-bold text-white">ProjectFlow</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="إحصائيات"
            >
              {showStats ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {isExtension && (
              <button
                onClick={() => chrome.runtime.openOptionsPage()}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="الإعدادات"
              >
                <Settings size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/20">
                <div className="text-center">
                  <p className="text-lg font-bold">{stats.total}</p>
                  <p className="text-[10px] text-white/70">الكل</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-300">{stats.done}</p>
                  <p className="text-[10px] text-white/70">مكتمل</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-300">{stats.inProgress}</p>
                  <p className="text-[10px] text-white/70">جاري</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-300">{stats.todo}</p>
                  <p className="text-[10px] text-white/70">انتظار</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-white/70 mb-1">
                  <span>نسبة الإنجاز</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-emerald-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search & Filter */}
      <div className="px-3 py-2 border-b border-gray-800 flex-shrink-0">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 pr-7 pl-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-2 py-1.5 text-[10px] text-gray-300 focus:outline-none"
          >
            <option value="newest">الأحدث</option>
            <option value="priority">الأولوية</option>
            <option value="dueDate">الموعد</option>
          </select>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mt-2">
          {([
            { id: "all", label: "الكل", count: stats.total },
            { id: "todo", label: "انتظار", count: stats.todo },
            { id: "in-progress", label: "جاري", count: stats.inProgress },
            { id: "done", label: "مكتمل", count: stats.done },
          ] as { id: FilterType; label: string; count: number }[]).map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-1 py-1 rounded-md text-[10px] font-medium transition-all ${
                filter === f.id
                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mb-3">
              {searchQuery ? <Search size={20} /> : <Star size={20} />}
            </div>
            <p className="text-xs">
              {searchQuery ? "لا توجد نتائج" : "لا توجد مهام بعد"}
            </p>
            <p className="text-[10px] mt-1">
              {searchQuery ? "جرب كلمة بحث مختلفة" : "اضغط + لإضافة مهمة جديدة"}
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className={`group flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                    task.status === "done"
                      ? "bg-gray-900/50 border-gray-800/50 opacity-60"
                      : "bg-gray-900 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.status === "done"
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-gray-600 hover:border-violet-400"
                    }`}
                  >
                    {task.status === "done" && <Check size={10} className="text-white" />}
                  </button>

                  {/* Task content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-medium truncate ${
                        task.status === "done" ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                          task.priority === "high"
                            ? "bg-red-500/15 text-red-400"
                            : task.priority === "medium"
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-emerald-500/15 text-emerald-400"
                        }`}
                      >
                        {task.priority === "high" ? "عالية" : task.priority === "medium" ? "متوسطة" : "منخفضة"}
                      </span>
                      {task.dueDate && (
                        <span className="text-[9px] text-gray-500 flex items-center gap-0.5">
                          <Calendar size={8} />
                          {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {task.status !== "done" && (
                      <>
                        <button
                          onClick={() =>
                            updateTaskStatus(
                              task.id,
                              task.status === "todo" ? "in-progress" : "todo"
                            )
                          }
                          className="p-1 rounded-md hover:bg-gray-800 text-gray-500 hover:text-amber-400"
                          title={task.status === "todo" ? "بدء التنفيذ" : "إعادة للانتظار"}
                        >
                          <Clock size={11} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 rounded-md hover:bg-gray-800 text-gray-500 hover:text-red-400"
                      title="حذف"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Task */}
      <div className="flex-shrink-0 border-t border-gray-800 px-3 py-2">
        <AnimatePresence>
          {showAddForm ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  placeholder="عنوان المهمة..."
                  autoFocus
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {(["low", "medium", "high"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setNewTaskPriority(p)}
                        className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                          newTaskPriority === p
                            ? p === "high"
                              ? "bg-red-500/20 text-red-400"
                              : p === "medium"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-emerald-500/20 text-emerald-400"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {p === "high" ? "عالية" : p === "medium" ? "متوسطة" : "منخفضة"}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-2 py-1 rounded-md text-[10px] text-gray-500 hover:text-gray-300"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={addTask}
                      disabled={!newTaskTitle.trim()}
                      className="px-3 py-1 rounded-md text-[10px] font-medium bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إضافة
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-gray-700 text-gray-500 hover:text-violet-400 hover:border-violet-500/50 transition-all text-xs"
            >
              <Plus size={14} />
              إضافة مهمة جديدة
            </button>
          )}
        </AnimatePresence>
      </div>

      {/* High priority warning */}
      {stats.highPriority > 0 && (
        <div className="flex-shrink-0 px-3 py-1.5 bg-red-500/10 border-t border-red-500/20 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-[10px] text-red-400">
            {stats.highPriority} مهام عالية الأولوية بحاجة لاهتمامك
          </span>
        </div>
      )}
    </div>
  );
}
