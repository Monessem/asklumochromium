import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import StatCard from "../components/StatCard";
import { format, subDays } from "date-fns";

interface DashboardProps {
  darkMode: boolean;
}

const areaData = Array.from({ length: 14 }, (_, i) => {
  const date = subDays(new Date(), 13 - i);
  return {
    date: format(date, "MM/dd"),
    مهام: Math.floor(Math.random() * 20) + 5,
    مكتمل: Math.floor(Math.random() * 15) + 3,
  };
});

const barData = [
  { name: "الأحد", value: 12 },
  { name: "الإثنين", value: 19 },
  { name: "الثلاثاء", value: 15 },
  { name: "الأربعاء", value: 22 },
  { name: "الخميس", value: 18 },
  { name: "الجمعة", value: 25 },
  { name: "السبت", value: 8 },
];

const recentActivities = [
  { id: 1, text: "تم إكمال مهمة تصميم الواجهة", time: "منذ 5 دقائق", type: "success" },
  { id: 2, text: "تم إضافة 3 مهام جديدة للسبرنت", time: "منذ 15 دقيقة", type: "info" },
  { id: 3, text: "موعد تسليم مشروع API غداً", time: "منذ ساعة", type: "warning" },
  { id: 4, text: "تم مراجعة كود المصادقة", time: "منذ ساعتين", type: "success" },
  { id: 5, text: "اجتماع الفريق الساعة 3 مساءً", time: "منذ 3 ساعات", type: "info" },
];

export default function Dashboard({ darkMode }: DashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          لوحة التحكم
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          مرحباً بك! إليك ملخص مشاريعك اليوم
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المهام"
          value="128"
          change="+12%"
          changeType="positive"
          icon={<CheckCircle2 size={22} className="text-violet-400" />}
          darkMode={darkMode}
          delay={0.1}
        />
        <StatCard
          title="قيد التنفيذ"
          value="34"
          change="+5%"
          changeType="positive"
          icon={<Clock size={22} className="text-amber-400" />}
          darkMode={darkMode}
          delay={0.2}
        />
        <StatCard
          title="أعضاء الفريق"
          value="12"
          change="+2"
          changeType="neutral"
          icon={<Users size={22} className="text-blue-400" />}
          darkMode={darkMode}
          delay={0.3}
        />
        <StatCard
          title="معدل الإنجاز"
          value="87%"
          change="+3%"
          changeType="positive"
          icon={<TrendingUp size={22} className="text-emerald-400" />}
          darkMode={darkMode}
          delay={0.4}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`lg:col-span-2 p-6 rounded-2xl border ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">تقدم المهام</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="date"
                stroke={darkMode ? "#6b7280" : "#9ca3af"}
                fontSize={12}
              />
              <YAxis
                stroke={darkMode ? "#6b7280" : "#9ca3af"}
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1f2937" : "#fff",
                  border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "12px",
                  color: darkMode ? "#fff" : "#000",
                }}
              />
              <Area
                type="monotone"
                dataKey="مهام"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorTasks)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="مكتمل"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorDone)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl border ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">إنجاز الأسبوع</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="name"
                stroke={darkMode ? "#6b7280" : "#9ca3af"}
                fontSize={11}
              />
              <YAxis
                stroke={darkMode ? "#6b7280" : "#9ca3af"}
                fontSize={11}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1f2937" : "#fff",
                  border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "12px",
                  color: darkMode ? "#fff" : "#000",
                }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`p-6 rounded-2xl border ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">آخر النشاطات</h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  activity.type === "success"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : activity.type === "warning"
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-blue-500/15 text-blue-400"
                }`}
              >
                {activity.type === "success" ? (
                  <CheckCircle2 size={16} />
                ) : activity.type === "warning" ? (
                  <AlertCircle size={16} />
                ) : (
                  <Clock size={16} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.text}</p>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
