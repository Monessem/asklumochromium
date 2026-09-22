import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import TaskBoard from "./pages/TaskBoard";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

export type Page = "dashboard" | "tasks" | "analytics" | "settings";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard darkMode={darkMode} />;
      case "tasks":
        return <TaskBoard darkMode={darkMode} />;
      case "analytics":
        return <Analytics darkMode={darkMode} />;
      case "settings":
        return <Settings darkMode={darkMode} setDarkMode={setDarkMode} />;
      default:
        return <Dashboard darkMode={darkMode} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {renderPage()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
