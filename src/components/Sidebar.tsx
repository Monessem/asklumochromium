import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import type { Page } from "../App";

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "الرئيسية", icon: <LayoutDashboard size={20} /> },
  { id: "tasks", label: "المهام", icon: <ListTodo size={20} /> },
  { id: "analytics", label: "التحليلات", icon: <BarChart3 size={20} /> },
  { id: "settings", label: "الإعدادات", icon: <Settings size={20} /> },
];

export default function Sidebar({
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
}: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 h-full z-40 flex flex-col border-r ${
        darkMode
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-gray-800/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
          <Zap size={20} className="text-white" />
        </div>
        {sidebarOpen && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent"
          >
            ProjectFlow
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? darkMode
                    ? "bg-violet-500/15 text-violet-400"
                    : "bg-violet-50 text-violet-600"
                  : darkMode
                  ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className={`flex-shrink-0 ${isActive ? "text-violet-400" : ""}`}>
                {item.icon}
              </span>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && sidebarOpen && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="p-3 border-t border-gray-800/50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-colors ${
            darkMode
              ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          {sidebarOpen && <span className="text-sm">طي القائمة</span>}
        </button>
      </div>
    </motion.aside>
  );
}
