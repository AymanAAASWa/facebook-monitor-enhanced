# خريطة الملفات - مراقب فيسبوك المتقدم

## 📁 الهيكل العام للمشروع

\`\`\`
facebook-monitor-enhanced/
├── 📱 app/                          # تطبيق Next.js الرئيسي
├── 🧩 components/                   # مكونات React القابلة لإعادة الاستخدام
├── 📚 lib/                          # مكتبات ووظائف مساعدة
├── 🎨 styles/                       # ملفات التنسيق
├── 📊 data/                         # بيانات تجريبية وثابتة
├── 📖 docs/                         # التوثيق والدلائل
├── 🔧 scripts/                      # سكريبتات البناء والنشر
└── ⚙️ config files                  # ملفات الإعداد
\`\`\`

## 📱 مجلد التطبيق (`app/`)

### 🏠 الصفحة الرئيسية
\`\`\`
app/
├── page.tsx                         # 🏠 الصفحة الرئيسية
├── layout.tsx                       # 📐 تخطيط التطبيق العام
├── globals.css                      # 🎨 التنسيقات العامة
└── loading.tsx                      # ⏳ صفحة التحميل
\`\`\`

**الوظائف**:
- `page.tsx`: نقطة دخول التطبيق، يعرض لوحة التحكم الرئيسية
- `layout.tsx`: يحدد الهيكل العام للصفحات (Header, Sidebar, Footer)
- `globals.css`: التنسيقات الأساسية والمتغيرات العامة

### 🔗 API Routes
\`\`\`
app/api/
├── facebook/
│   ├── posts/route.ts               # 📝 API جلب المنشورات
│   ├── validate/route.ts            # ✅ API التحقق من صحة Token
│   ├── comments/route.ts            # 💬 API إدارة التعليقات
│   └── users/route.ts               # 👥 API بيانات المستخدمين
├── auth/
│   ├── login/route.ts               # 🔐 API تسجيل الدخول
│   └── logout/route.ts              # 🚪 API تسجيل الخروج
└── data/
    ├── export/route.ts              # 📤 API تصدير البيانات
    └── import/route.ts              # 📥 API استيراد البيانات
\`\`\`

## 🧩 مجلد المكونات (`components/`)

### 🔐 مكونات التوثيق
\`\`\`
components/auth/
├── login-form.tsx                   # 📝 نموذج تسجيل الدخول
├── facebook-login-form.tsx          # 📘 تسجيل دخول Facebook
├── register-form.tsx                # ✍️ نموذج إنشاء حساب
└── auth-guard.tsx                   # 🛡️ حماية الصفحات
\`\`\`

**الوظائف**:
- `login-form.tsx`: نموذج تسجيل الدخول بالبريد الإلكتروني
- `facebook-login-form.tsx`: تسجيل الدخول باستخدام Facebook API
- `auth-guard.tsx`: يحمي الصفحات من الوصول غير المصرح به

### 📊 مكونات البيانات والتحليلات
\`\`\`
components/
├── analytics-dashboard.tsx          # 📈 لوحة التحليلات الأساسية
├── advanced-analytics-dashboard.tsx # 🔬 لوحة التحليلات المتقدمة
├── user-table.tsx                   # 👥 جدول المستخدمين
├── posts-list.tsx                   # 📝 قائمة المنشورات
├── post-card.tsx                    # 🃏 بطاقة المنشور الواحد
├── comments-manager.tsx             # 💬 إدارة التعليقات
├── messages-manager.tsx             # 📨 إدارة الرسائل
└── phone-database-manager.tsx       # 📞 إدارة قاعدة بيانات الأرقام
\`\`\`

**الوظائف**:
- `analytics-dashboard.tsx`: عرض الإحصائيات والرسوم البيانية الأساسية
- `advanced-analytics-dashboard.tsx`: تحليلات معقدة مع رسوم بيانية تفاعلية
- `user-table.tsx`: جدول قابل للفرز والبحث لعرض المستخدمين
- `posts-list.tsx`: قائمة المنشورات مع إمكانيات الفلترة والبحث
- `post-card.tsx`: عرض منشور واحد مع التفاصيل والتفاعلات
- `comments-manager.tsx`: إدارة وعرض التعليقات مع إمكانية الرد
- `phone-database-manager.tsx`: تحميل وإدارة قاعدة بيانات أرقام الهواتف

### 🔧 مكونات الإعدادات والتحكم
\`\`\`
components/
├── settings-panel.tsx               # ⚙️ لوحة الإعدادات العامة
├── facebook-monitor.tsx             # 📱 مراقب Facebook الرئيسي
├── auto-collection-control.tsx      # 🤖 التحكم في التجميع التلقائي
├── enhanced-data-viewer.tsx         # 🔍 عارض البيانات المحسنة
├── enhanced-user-details.tsx        # 👤 تفاصيل المستخدم المحسنة
├── enhanced-page-details.tsx        # 📄 تفاصيل الصفحة المحسنة
├── enhanced-group-details.tsx       # 👥 تفاصيل المجموعة المحسنة
└── documentation-export.tsx         # 📚 تصدير التوثيق
\`\`\`

**الوظائف**:
- `settings-panel.tsx`: إعدادات التطبيق وإدارة Facebook API
- `facebook-monitor.tsx`: المكون الرئيسي لمراقبة Facebook
- `auto-collection-control.tsx`: أتمتة جمع البيانات وجدولة المهام
- `enhanced-data-viewer.tsx`: عرض البيانات المحسنة مع فلاتر متقدمة
- `enhanced-user-details.tsx`: عرض تفصيلي لبيانات المستخدم المحسنة
- `documentation-export.tsx`: تصدير التوثيق بصيغ مختلفة

### 🎨 مكونات واجهة المستخدم
\`\`\`
components/ui/
├── button.tsx                       # 🔘 أزرار قابلة للتخصيص
├── card.tsx                         # 🃏 بطاقات المحتوى
├── input.tsx                        # ⌨️ حقول الإدخال
├── select.tsx                       # 📋 قوائم الاختيار
├── tabs.tsx                         # 📑 التبويبات
├── badge.tsx                        # 🏷️ الشارات والعلامات
├── dialog.tsx                       # 💬 النوافذ المنبثقة
├── toast.tsx                        # 🍞 إشعارات التوست
├── chart.tsx                        # 📊 مكونات الرسوم البيانية
└── table.tsx                        # 📋 الجداول التفاعلية
\`\`\`

## 📚 مجلد المكتبات (`lib/`)

### 🔗 خدمات API
\`\`\`
lib/
├── facebook-service.ts              # 📘 خدمة Facebook API الأساسية
├── facebook-api-service.ts          # 🔧 خدمة Facebook API المتقدمة
├── enhanced-facebook-service.ts     # ⚡ خدمة Facebook المحسنة
├── facebook-oauth-service.ts        # 🔐 خدمة OAuth لـ Facebook
├── facebook-comments-service.ts     # 💬 خدمة التعليقات
└── google-drive-service.ts          # 💾 خدمة Google Drive
\`\`\`

**الوظائف**:
- `facebook-service.ts`: الوظائف الأساسية للتفاعل مع Facebook API
- `facebook-api-service.ts`: وظائف متقدمة لجلب البيانات وتحليلها
- `enhanced-facebook-service.ts`: خدمات محسنة مع ذكاء اصطناعي
- `facebook-oauth-service.ts`: التوثيق والترخيص مع Facebook
- `facebook-comments-service.ts`: إدارة التعليقات والردود

### 🗄️ خدمات قواعد البيانات
\`\`\`
lib/
├── firebase.ts                      # 🔥 إعداد Firebase
├── firebase-service.ts              # 🔥 خدمات Firebase الأساسية
├── firebase-enhanced-service.ts     # ⚡ خدمات Firebase المحسنة
├── phone-database-service.ts        # 📞 خدمة قاعدة بيانات الأرقام
└── large-file-search-service.ts     # 🔍 البحث في الملفات الكبيرة
\`\`\`

**الوظائف**:
- `firebase.ts`: إعداد الاتصال مع Firebase
- `firebase-service.ts`: عمليات CRUD الأساسية
- `firebase-enhanced-service.ts`: عمليات متقدمة مع فهرسة وبحث
- `phone-database-service.ts`: إدارة قاعدة بيانات أرقام الهواتف
- `large-file-search-service.ts`: البحث السريع في الملفات الكبيرة

### 🧠 خدمات التحليل والذكاء الاصطناعي
\`\`\`
lib/
├── advanced-analytics-service.ts    # 📊 خدمة التحليلات المتقدمة
├── data-processor.ts                # ⚙️ معالج البيانات
├── phone-search-service.ts          # 🔍 خدمة البحث عن الأرقام
├── auto-data-collector.ts           # 🤖 جامع البيانات التلقائي
└── app-context.tsx                  # 🌐 سياق التطبيق العام
\`\`\`

**الوظائف**:
- `advanced-analytics-service.ts`: تحليلات معقدة وإحصائيات متقدمة
- `data-processor.ts`: معالجة وتنظيف البيانات
- `phone-search-service.ts`: البحث السريع في أرقام الهواتف
- `auto-data-collector.ts`: جمع البيانات تلقائياً بجدولة زمنية

### 🛠️ أدوات مساعدة
\`\`\`
lib/
├── utils.ts                         # 🔧 وظائف مساعدة عامة
├── constants.ts                     # 📋 الثوابت والإعدادات
├── types.ts                         # 📝 تعريفات الأنواع TypeScript
├── validators.ts                    # ✅ التحقق من صحة البيانات
└── formatters.ts                    # 🎨 تنسيق البيانات للعرض
\`\`\`

## 📊 مجلد البيانات (`data/`)

\`\`\`
data/
├── test-phone-data.json             # 📞 بيانات أرقام هواتف تجريبية
├── sample-posts.json                # 📝 منشورات تجريبية
├── mock-users.json                  # 👥 مستخدمين وهميين
├── facebook-permissions.json        # 🔐 صلاحيات Facebook
└── analytics-templates.json         # 📊 قوالب التحليلات
\`\`\`

## 📖 مجلد التوثيق (`docs/`)

\`\`\`
docs/
├── project-documentation.md         # 📚 التوثيق الشامل للمشروع
├── site-map.md                      # 🗺️ خريطة الموقع
├── file-structure-map.md            # 📁 خريطة الملفات (هذا الملف)
├── api-documentation.md             # 🔗 توثيق API
├── user-guide.md                    # 👤 دليل المستخدم
├── developer-guide.md               # 👨‍💻 دليل المطور
├── troubleshooting.md               # 🔧 حل المشاكل
└── changelog.md                     # 📝 سجل التغييرات
\`\`\`

## ⚙️ ملفات الإعداد

\`\`\`
├── package.json                     # 📦 إعدادات npm والتبعيات
├── tsconfig.json                    # 📝 إعدادات TypeScript
├── tailwind.config.ts               # 🎨 إعدادات Tailwind CSS
├── next.config.mjs                  # ⚡ إعدادات Next.js
├── .env.local                       # 🔐 متغيرات البيئة المحلية
├── .env.example                     # 📋 مثال على متغيرات البيئة
├── .gitignore                       # 🚫 ملفات مستبعدة من Git
├── README.md                        # 📖 ملف التعريف بالمشروع
└── firebase.json                    # 🔥 إعدادات Firebase
\`\`\`

## 🔄 تدفق البيانات في التطبيق

### 📥 جلب البيانات
\`\`\`
1. المستخدم → settings-panel.tsx
2. settings-panel.tsx → facebook-service.ts
3. facebook-service.ts → Facebook API
4. Facebook API → firebase-service.ts
5. firebase-service.ts → Firebase Database
\`\`\`

### 📊 معالجة البيانات
\`\`\`
1. Firebase Database → data-processor.ts
2. data-processor.ts → advanced-analytics-service.ts
3. advanced-analytics-service.ts → analytics-dashboard.tsx
4. analytics-dashboard.tsx → المستخدم
\`\`\`

### 🔍 البحث عن الأرقام
\`\`\`
1. المستخدم → phone-database-manager.tsx
2. phone-database-manager.tsx → large-file-search-service.ts
3. large-file-search-service.ts → phone-search-service.ts
4. phone-search-service.ts → النتائج → المستخدم
\`\`\`

## 🎯 الملفات الأساسية للمطورين

### 🚀 للبدء السريع
1. `app/page.tsx` - نقطة البداية
2. `lib/firebase.ts` - إعداد قاعدة البيانات
3. `components/settings-panel.tsx` - إعداد Facebook API
4. `lib/facebook-service.ts` - جلب البيانات

### 🔧 للتطوير المتقدم
1. `lib/enhanced-facebook-service.ts` - خدمات محسنة
2. `components/advanced-analytics-dashboard.tsx` - تحليلات متقدمة
3. `lib/auto-data-collector.ts` - أتمتة العمليات
4. `components/enhanced-data-viewer.tsx` - عرض البيانات المحسنة

### 🐛 لحل المشاكل
1. `docs/troubleshooting.md` - دليل حل المشاكل
2. `lib/utils.ts` - وظائف التشخيص
3. `app/api/*/route.ts` - نقاط API للاختبار
4. Browser DevTools - أدوات المطور

## 📱 ملفات خاصة بالأجهزة المحمولة

\`\`\`
├── manifest.json                    # 📱 إعدادات PWA
├── sw.js                           # 🔄 Service Worker
├── icons/                          # 🎨 أيقونات التطبيق
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── favicon.ico
└── offline.html                    # 📴 صفحة العمل بدون اتصال
\`\`\`

## 🔒 ملفات الأمان

\`\`\`
├── .env.local                      # 🔐 مفاتيح API المحلية
├── firebase-admin-key.json         # 🔥 مفتاح Firebase Admin
├── security-rules.js               # 🛡️ قواعد الأمان
└── cors-config.json                # 🌐 إعدادات CORS
\`\`\`

## 📈 ملفات المراقبة والأداء

\`\`\`
├── analytics.js                    # 📊 تتبع الاستخدام
├── performance.js                  # ⚡ مراقبة الأداء
├── error-tracking.js               # 🐛 تتبع الأخطاء
└── logs/                          # 📝 ملفات السجلات
    ├── app.log
    ├── error.log
    └── access.log
\`\`\`

## 🎨 ملفات التصميم والأصول

\`\`\`
public/
├── images/                         # 🖼️ الصور
│   ├── logo.png
│   ├── placeholder.svg
│   └── screenshots/
├── fonts/                          # 🔤 الخطوط
│   ├── arabic-font.woff2
│   └── english-font.woff2
└── styles/                         # 🎨 ملفات CSS إضافية
    ├── print.css
    └── mobile.css
\`\`\`

## 🧪 ملفات الاختبار

\`\`\`
tests/
├── unit/                           # 🔬 اختبارات الوحدة
│   ├── components/
│   ├── lib/
│   └── utils/
├── integration/                    # 🔗 اختبارات التكامل
│   ├── api/
│   └── database/
├── e2e/                           # 🎭 اختبارات شاملة
│   ├── user-flows/
│   └── scenarios/
└── fixtures/                      # 📋 بيانات اختبار ثابتة
    ├── mock-data.json
    └── test-users.json
\`\`\`

## 🚀 ملفات النشر والإنتاج

\`\`\`
├── Dockerfile                      # 🐳 إعداد Docker
├── docker-compose.yml              # 🐳 Docker Compose
├── vercel.json                     # ▲ إعدادات Vercel
├── netlify.toml                    # 🌐 إعدادات Netlify
└── scripts/
    ├── build.sh                    # 🔨 سكريبت البناء
    ├── deploy.sh                   # 🚀 سكريبت النشر
    └── backup.sh                   # 💾 سكريبت النسخ الاحتياطي
\`\`\`

## 💡 نصائح للمطورين

### 🔍 للعثور على ملف معين
- **المكونات**: ابحث في `components/`
- **منطق العمل**: ابحث في `lib/`
- **صفحات التطبيق**: ابحث في `app/`
- **التوثيق**: ابحث في `docs/`

### 🛠️ للإضافة أو التعديل
- **مكون جديد**: أضف في `components/` مع ملف TypeScript
- **خدمة جديدة**: أضف في `lib/` مع تصدير الوظائف
- **صفحة جديدة**: أضف في `app/` مع `page.tsx`
- **API جديد**: أضف في `app/api/` مع `route.ts`

### 🔧 للصيانة والتطوير
- **تحديث التبعيات**: `package.json`
- **إضافة أنواع جديدة**: `lib/types.ts`
- **تحديث الثوابت**: `lib/constants.ts`
- **إضافة وظائف مساعدة**: `lib/utils.ts`

---

*هذه الخريطة تساعد المطورين في فهم بنية المشروع والعثور على الملفات المطلوبة بسرعة. لمزيد من التفاصيل، راجع التوثيق الفني أو دليل المطور.*
