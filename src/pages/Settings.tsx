import { motion } from "framer-motion";
import { Moon, Sun, Bell, Shield, Globe, Palette, User } from "lucide-react";
import { useState } from "react";

interface SettingsProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function Settings({ darkMode, setDarkMode }: SettingsProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [language, setLanguage] = useState("ar");
  const [autoSave, setAutoSave] = useState(true);

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? "bg-violet-500" : darkMode ? "bg-gray-700" : "bg-gray-300"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );

  const settingsSections = [
    {
      title: "المظهر",
      icon: <Palette size={18} className="text-violet-400" />,
      items: [
        {
          label: "الوضع الداكن",
          description: "تفعيل الوضع الداكن للواجهة",
          control: <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />,
        },
      ],
    },
    {
      title: "الإشعارات",
      icon: <Bell size={18} className="text-amber-400" />,
      items: [
        {
          label: "إشعارات التطبيق",
          description: "تلقي إشعارات داخل التطبيق",
          control: <Toggle enabled={notifications} onChange={() => setNotifications(!notifications)} />,
        },
        {
          label: "إشعارات البريد",
          description: "تلقي إشعارات عبر البريد الإلكتروني",
          control: <Toggle enabled={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />,
        },
      ],
    },
    {
      title: "اللغة والمنطقة",
      icon: <Globe size={18} className="text-blue-400" />,
      items: [
        {
          label: "اللغة",
          description: "اختر لغة الواجهة",
          control: (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          ),
        },
      ],
    },
    {
      title: "الأمان",
      icon: <Shield size={18} className="text-emerald-400" />,
      items: [
        {
          label: "المصادقة الثنائية",
          description: "حماية إضافية لحسابك",
          control: <Toggle enabled={false} onChange={() => {}} />,
        },
      ],
    },
    {
      title: "عام",
      icon: <User size={18} className="text-pink-400" />,
      items: [
        {
          label: "الحفظ التلقائي",
          description: "حفظ التغييرات تلقائياً",
          control: <Toggle enabled={autoSave} onChange={() => setAutoSave(!autoSave)} />,
        },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 max-w-3xl"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          تخصيص تجربتك في ProjectFlow
        </p>
      </div>

      {/* Theme Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            {darkMode ? <Moon size={22} className="text-violet-400" /> : <Sun size={22} className="text-amber-400" />}
          </div>
          <div>
            <h3 className="font-semibold">المظهر الحالي</h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {darkMode ? "الوضع الداكن مفعّل" : "الوضع الفاتح مفعّل"}
            </p>
          </div>
          <div className="ml-auto">
            <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setDarkMode(true)}
            className={`p-4 rounded-xl border-2 transition-all ${
              darkMode
                ? "border-violet-500 bg-violet-500/10"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="w-full h-16 rounded-lg bg-gray-900 mb-2 flex items-center justify-center">
              <Moon size={16} className="text-gray-400" />
            </div>
            <span className="text-sm font-medium">داكن</span>
          </button>
          <button
            onClick={() => setDarkMode(false)}
            className={`p-4 rounded-xl border-2 transition-all ${
              !darkMode
                ? "border-violet-500 bg-violet-500/10"
                : "border-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="w-full h-16 rounded-lg bg-white border border-gray-200 mb-2 flex items-center justify-center">
              <Sun size={16} className="text-amber-400" />
            </div>
            <span className="text-sm font-medium">فاتح</span>
          </button>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (sectionIndex + 1) * 0.1 }}
            className={`p-6 rounded-2xl border ${
              darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {section.icon}
              <h3 className="font-semibold">{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between py-2 ${
                    section.items.indexOf(item) > 0
                      ? `border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`
                      : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {item.description}
                    </p>
                  </div>
                  {item.control}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-2xl border border-red-500/30 ${
          darkMode ? "bg-red-500/5" : "bg-red-50"
        }`}
      >
        <h3 className="font-semibold text-red-400 mb-2">منطقة الخطر</h3>
        <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          هذه الإجراءات لا يمكن التراجع عنها
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors">
            حذف جميع البيانات
          </button>
          <button className="px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors">
            حذف الحساب
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
