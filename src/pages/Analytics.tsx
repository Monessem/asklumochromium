import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { TrendingUp, Target, Award, Zap } from "lucide-react";

interface AnalyticsProps {
  darkMode: boolean;
}

const pieData = [
  { name: "مكتمل", value: 45, color: "#10b981" },
  { name: "قيد التنفيذ", value: 30, color: "#f59e0b" },
  { name: "مراجعة", value: 15, color: "#3b82f6" },
  { name: "متأخر", value: 10, color: "#ef4444" },
];

const lineData = [
  { month: "يناير", إنتاجية: 65, أهداف: 80 },
  { month: "فبراير", إنتاجية: 72, أهداف: 80 },
  { month: "مارس", إنتاجية: 78, أهداف: 80 },
  { month: "أبريل", إنتاجية: 85, أهداف: 80 },
  { month: "مايو", إنتاجية: 82, أهداف: 80 },
  { month: "يونيو", إنتاجية: 90, أهداف: 80 },
  { month: "يوليو", إنتاجية: 88, أهداف: 80 },
];

const radarData = [
  { skill: "التصميم", A: 85 },
  { skill: "التطوير", A: 92 },
  { skill: "الإدارة", A: 78 },
  { skill: "التواصل", A: 88 },
  { skill: "الإبداع", A: 75 },
  { skill: "القيادة", A: 82 },
];

const teamPerformance = [
  { name: "أحمد محمد", tasks: 45, completion: 92, avatar: "👨‍💻" },
  { name: "سارة أحمد", tasks: 38, completion: 88, avatar: "👩‍💼" },
  { name: "محمد علي", tasks: 52, completion: 95, avatar: "👨‍🔧" },
  { name: "فاطمة حسن", tasks: 41, completion: 90, avatar: "👩‍🎨" },
  { name: "خالد عمر", tasks: 35, completion: 85, avatar: "👨‍🏫" },
];

export default function Analytics({ darkMode }: AnalyticsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">التحليلات</h1>
        <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          نظرة شاملة على أداء الفريق والمشاريع
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "معدل الإنجاز", value: "87%", icon: <Target size={20} className="text-violet-400" />, color: "from-violet-500/20 to-purple-500/20" },
          { label: "المهام المكتملة", value: "234", icon: <Award size={20} className="text-emerald-400" />, color: "from-emerald-500/20 to-green-500/20" },
          { label: "النقاط المحرزة", value: "1,850", icon: <Zap size={20} className="text-amber-400" />, color: "from-amber-500/20 to-yellow-500/20" },
          { label: "نمو الإنتاجية", value: "+23%", icon: <TrendingUp size={20} className="text-blue-400" />, color: "from-blue-500/20 to-cyan-500/20" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-2xl border bg-gradient-to-br ${stat.color} ${
              darkMode ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-800/50" : "bg-white/80"}`}>
                {stat.icon}
              </div>
              <div>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{stat.label}</p>
                <p className="text-xl font-bold mt-0.5">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl border ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">توزيع المهام</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1f2937" : "#fff",
                  border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "12px",
                  color: darkMode ? "#fff" : "#000",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl border ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">الإنتاجية الشهرية</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
              <XAxis dataKey="month" stroke={darkMode ? "#6b7280" : "#9ca3af"} fontSize={11} />
              <YAxis stroke={darkMode ? "#6b7280" : "#9ca3af"} fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1f2937" : "#fff",
                  border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "12px",
                  color: darkMode ? "#fff" : "#000",
                }}
              />
              <Line type="monotone" dataKey="إنتاجية" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4 }} />
              <Line type="monotone" dataKey="أهداف" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl border ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">مهارات الفريق</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={darkMode ? "#374151" : "#e5e7eb"} />
              <PolarAngleAxis dataKey="skill" stroke={darkMode ? "#9ca3af" : "#6b7280"} fontSize={11} />
              <PolarRadiusAxis stroke={darkMode ? "#4b5563" : "#d1d5db"} fontSize={10} />
              <Radar name="المهارات" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Team Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`p-6 rounded-2xl border ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">أداء الفريق</h3>
        <div className="space-y-4">
          {teamPerformance.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`flex items-center gap-4 p-3 rounded-xl ${
                darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
              } transition-colors`}
            >
              <span className="text-2xl">{member.avatar}</span>
              <div className="flex-1">
                <p className="font-medium text-sm">{member.name}</p>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {member.tasks} مهمة مكتملة
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-32 h-2 rounded-full ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${member.completion}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                  />
                </div>
                <span className="text-sm font-medium w-10 text-left">{member.completion}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
