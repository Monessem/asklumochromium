# ⚡ ProjectFlow - Chrome Extension

إضافة متصفح لإدارة المهام السريعة، متوافقة مع Chrome Web Store و Manifest V3.

## 📁 هيكل المشروع

```
dist/                    ← مجلد الإضافة الجاهز (بعد البناء)
├── manifest.json        ← إعدادات الإضافة (Manifest V3)
├── index.html           ← Popup الرئيسي (React app)
├── background.js        ← Service Worker
├── content.js           ← Content Script (زر الإضافة السريع)
├── content.css          ← Styles للـ Content Script
├── options.html         ← صفحة الإعدادات
├── options.js           ← Logic لصفحة الإعدادات
├── privacy.html         ← سياسة الخصوصية
├── generate-icons.html  ← أداة لتوليد الأيقونات
└── icons/               ← أيقونات الإضافة
```

## 🚀 التثبيت المحلي (للتطوير)

1. ابني المشروع:
   ```bash
   npm run build
   ```

2. ولّد الأيقونات:
   - افتح `dist/generate-icons.html` في المتصفح
   - اضغط "توليد وتحميل جميع الأحجام"
   - انقل ملفات PNG إلى `dist/icons/`

3. حمّل الإضافة في Chrome:
   - افتح `chrome://extensions/`
   - فعّل "Developer mode"
   - اضغط "Load unpacked"
   - اختر مجلد `dist/`

## 📤 النشر على Chrome Web Store

### المتطلبات:
1. **أيقونات PNG** (16x16, 32x32, 48x48, 128x128)
   - ولّدها من `generate-icons.html`
   - أو استخدم أي أداة تصميم

2. **تحديث manifest.json** لإضافة الأيقونات:
   ```json
   {
     "icons": {
       "16": "icons/icon16.png",
       "32": "icons/icon32.png",
       "48": "icons/icon48.png",
       "128": "icons/icon128.png"
     },
     "action": {
       "default_icon": {
         "16": "icons/icon16.png",
         "32": "icons/icon32.png",
         "48": "icons/icon48.png",
         "128": "icons/icon128.png"
       }
     }
   }
   ```

3. **ضغط المجلد كـ ZIP**:
   ```bash
   cd dist && zip -r ../projectflow-extension.zip .
   ```

4. **ارفع على Chrome Web Store**:
   - ادخل [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - اضغط "New Item"
   - ارفع ملف ZIP
   - املأ البيانات الوصفية ( screenshots, description, etc.)
   - ارفع سياسة الخصوصية (موجودة في `privacy.html`)

## ✅ التوافق مع سياسات Chrome Web Store

| السياسة | الحالة |
|---------|--------|
| Manifest V3 | ✅ |
| أقل permissions ممكنة | ✅ (storage, alarms, notifications فقط) |
| لا remote code | ✅ |
| CSP واضحة | ✅ |
| Service Worker | ✅ |
| سياسة خصوصية | ✅ |
| لا بيانات شخصية | ✅ (كل شيء محلي) |
| لا تتبع المستخدم | ✅ |

## 🎯 المميزات

- ⚡ إضافة مهام سريعة من أي صفحة (زر عائم)
- 📋 إدارة المهام في Popup
- 🔔 تذكيرات قبل موعد التسليم
- 🎨 واجهة عربية كاملة
- ⌨️ اختصارات لوحة مفاتيح
- 📊 إحصائيات سريعة
- 🔍 بحث وفلترة
- 💾 حفظ محلي (لا يحتاج سيرفر)

## ⌨️ اختصارات لوحة المفاتيح

| الاختصار | الوظيفة |
|----------|---------|
| `Alt+Shift+P` | فتح ProjectFlow |
| `Alt+Shift+A` | إضافة مهمة سريعة |

## 🔧 التطوير

```bash
# تثبيت المكتبات
npm install

# تشغيل بيئة التطوير
npm run dev

# بناء للنشر
npm run build
```

## 📝 ملاحظات مهمة

- الإضافة تخزن كل البيانات محلياً باستخدام `chrome.storage.local`
- لا يتم إرسال أي بيانات لخوادم خارجية
- الـ Content Script يظهر زر عائم في أسفل يسار كل صفحة
- الـ Popup حجمه 380x520 بكسل (مناسب لـ Chrome)

## 📄 الترخيص

MIT License
