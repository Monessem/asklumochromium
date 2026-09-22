import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  darkMode: boolean;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  darkMode,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        darkMode
          ? "bg-gray-900 border-gray-800 hover:shadow-violet-500/5"
          : "bg-white border-gray-200 hover:shadow-gray-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {title}
          </p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          <div className="flex items-center gap-1 mt-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                changeType === "positive"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : changeType === "negative"
                  ? "bg-red-500/15 text-red-400"
                  : "bg-gray-500/15 text-gray-400"
              }`}
            >
              {change}
            </span>
            <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              من الشهر الماضي
            </span>
          </div>
        </div>
        <div
          className={`p-3 rounded-xl ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
