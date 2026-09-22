import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Calendar, Tag, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import confetti from "canvas-confetti";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  tags: string[];
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

interface TaskBoardProps {
  darkMode: boolean;
}

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "قيد الانتظار",
    color: "bg-gray-500",
    tasks: [
      { id: uuidv4(), title: "تصميم صفحة الهبوط", description: "إنشاء تصميم حديث لصفحة الهبوط الرئيسية", priority: "high", dueDate: "2026-01-20", tags: ["تصميم", "UI"] },
      { id: uuidv4(), title: "إعداد قاعدة البيانات", description: "إنشاء الجداول والعلاقات", priority: "medium", dueDate: "2026-01-22", tags: ["Backend"] },
      { id: uuidv4(), title: "كتابة التوثيق", description: "توثيق API endpoints", priority: "low", dueDate: "2026-01-25", tags: ["توثيق"] },
    ],
  },
  {
    id: "in-progress",
    title: "قيد التنفيذ",
    color: "bg-amber-500",
    tasks: [
      { id: uuidv4(), title: "تطوير نظام المصادقة", description: "تطبيق JWT + OAuth2", priority: "high", dueDate: "2026-01-18", tags: ["Backend", "Security"] },
      { id: uuidv4(), title: "تحسين الأداء", description: "تحسين سرعة تحميل الصفحات", priority: "medium", dueDate: "2026-01-19", tags: ["Performance"] },
    ],
  },
  {
    id: "review",
    title: "مراجعة",
    color: "bg-blue-500",
    tasks: [
      { id: uuidv4(), title: "مراجعة كود الـ Dashboard", description: "مراجعة الـ components الجديدة", priority: "medium", dueDate: "2026-01-17", tags: ["Code Review"] },
    ],
  },
  {
    id: "done",
    title: "مكتمل",
    color: "bg-emerald-500",
    tasks: [
      { id: uuidv4(), title: "إعداد بيئة التطوير", description: "تثبيت الأدوات والإعدادات", priority: "low", dueDate: "2026-01-10", tags: ["DevOps"] },
      { id: uuidv4(), title: "تصميم الشعار", description: "إنشاء شعار المشروع", priority: "medium", dueDate: "2026-01-12", tags: ["تصميم"] },
    ],
  },
];

function SortableTask({ task, darkMode }: { task: Task; darkMode: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: "bg-emerald-500/15 text-emerald-400",
    medium: "bg-amber-500/15 text-amber-400",
    high: "bg-red-500/15 text-red-400",
  };

  const priorityLabels = {
    low: "منخفضة",
    medium: "متوسطة",
    high: "عالية",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-4 rounded-xl border cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging
          ? "shadow-2xl shadow-violet-500/20 ring-2 ring-violet-500/50"
          : ""
      } ${
        darkMode
          ? "bg-gray-800/80 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className={`mt-1 p-1 rounded ${darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
        >
          <GripVertical size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{task.title}</h4>
          <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {task.description}
          </p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
              {priorityLabels[task.priority]}
            </span>
            {task.tags.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className={`flex items-center gap-1 mt-2 text-[10px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            <Calendar size={10} />
            <span>{task.dueDate}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TaskCard({ task, darkMode }: { task: Task; darkMode: boolean }) {
  return <SortableTask task={task} darkMode={darkMode} />;
}

export default function TaskBoard({ darkMode }: TaskBoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" as Task["priority"] });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findColumnByTaskId = (taskId: string) => {
    return columns.find((col) => col.tasks.some((t) => t.id === taskId));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const column = findColumnByTaskId(active.id as string);
    if (column) {
      const task = column.tasks.find((t) => t.id === active.id);
      setActiveTask(task || null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeColumn = findColumnByTaskId(active.id as string);
    let overColumn = findColumnByTaskId(over.id as string);

    if (!overColumn) {
      overColumn = columns.find((col) => col.id === over.id);
    }

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

    setColumns((prev) => {
      const activeCol = prev.find((c) => c.id === activeColumn.id)!;
      const overCol = prev.find((c) => c.id === overColumn!.id)!;

      const activeTask = activeCol.tasks.find((t) => t.id === active.id);
      if (!activeTask) return prev;

      return prev.map((col) => {
        if (col.id === activeColumn.id) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== active.id) };
        }
        if (col.id === overColumn!.id) {
          const overIndex = col.tasks.findIndex((t) => t.id === over.id);
          const insertIndex = overIndex >= 0 ? overIndex : col.tasks.length;
          const newTasks = [...col.tasks];
          newTasks.splice(insertIndex, 0, activeTask);
          return { ...col, tasks: newTasks };
        }
        return col;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeColumn = findColumnByTaskId(active.id as string);
    const overColumn = findColumnByTaskId(over.id as string) || columns.find((col) => col.id === over.id);

    if (overColumn && overColumn.id === "done") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id === overColumn.id) {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id !== activeColumn.id) return col;
          const tasks = [...col.tasks];
          const oldIndex = tasks.findIndex((t) => t.id === active.id);
          const newIndex = tasks.findIndex((t) => t.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return col;
          const [moved] = tasks.splice(oldIndex, 1);
          tasks.splice(newIndex, 0, moved);
          return { ...col, tasks };
        })
      );
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: uuidv4(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: "2026-01-30",
      tags: [],
    };
    setColumns((prev) =>
      prev.map((col) =>
        col.id === "todo" ? { ...col, tasks: [...col.tasks, task] } : col
      )
    );
    setNewTask({ title: "", description: "", priority: "medium" });
    setShowAddModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة المهام</h1>
          <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            اسحب وأفلت المهام بين الأعمدة
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all"
        >
          <Plus size={16} />
          إضافة مهمة
        </button>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`rounded-2xl p-4 ${
                darkMode ? "bg-gray-900/50" : "bg-gray-100/80"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-600"}`}>
                  {column.tasks.length}
                </span>
              </div>
              <SortableContext
                items={column.tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[200px]">
                  <AnimatePresence>
                    {column.tasks.map((task) => (
                      <TaskCard key={task.id} task={task} darkMode={darkMode} />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className={`p-4 rounded-xl border shadow-2xl w-72 ${
              darkMode ? "bg-gray-800 border-violet-500/50" : "bg-white border-violet-300"
            }`}>
              <h4 className="font-medium text-sm">{activeTask.title}</h4>
              <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {activeTask.description}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md p-6 rounded-2xl border ${
                darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">إضافة مهمة جديدة</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`p-1 rounded-lg ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    عنوان المهمة
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="أدخل عنوان المهمة..."
                    className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-violet-500/50`}
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    الوصف
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="أدخل وصف المهمة..."
                    rows={3}
                    className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm resize-none ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-violet-500/50`}
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    الأولوية
                  </label>
                  <div className="flex gap-2 mt-2">
                    {(["low", "medium", "high"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setNewTask({ ...newTask, priority: p })}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          newTask.priority === p
                            ? p === "low"
                              ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50"
                              : p === "medium"
                              ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50"
                              : "bg-red-500/20 text-red-400 ring-1 ring-red-500/50"
                            : darkMode
                            ? "bg-gray-800 text-gray-400"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p === "low" ? "منخفضة" : p === "medium" ? "متوسطة" : "عالية"}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAddTask}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all"
                >
                  إضافة المهمة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
