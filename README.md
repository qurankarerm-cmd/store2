# أعمالي بالطين - Arabic Polymer Clay Store

متجر إلكتروني متكامل لبيع المنتجات اليدوية من الطين البوليمر مع لوحة تحكم إدارية. الموقع مصمم بالكامل باللغة العربية مع دعم RTL ويعتمد على التواصل عبر واتساب لإتمام الطلبات.

## المميزات الرئيسية

### الموقع العام (العملاء)
- 🏠 **الصفحة الرئيسية**: عرض ترحيبي وأبرز المنتجات
- 🛍️ **كتالوج المنتجات**: عرض جميع المنتجات مع إمكانية البحث والفلترة
- ✨ **صفحة الطلب المخصص**: دليل خطوة بخطوة لطلب منتج مخصص
- ⭐ **صفحة آراء العملاء**: عرض تقييمات العملاء المعتمدة
- 📞 **صفحة التواصل**: معلومات التواصل والأسئلة الشائعة
- 💬 **تكامل واتساب**: أزرار واتساب عائمة مع رسائل معدة مسبقاً
- 🌐 **دعم RTL كامل**: تصميم مناسب للغة العربية
- 📱 **تصميم متجاوب**: يعمل على جميع الأجهزة

### لوحة التحكم الإدارية
- 🔐 **نظام مصادقة آمن**: تسجيل دخول محمي بـ JWT
- 📊 **لوحة تحكم شاملة**: إحصائيات ونظرة عامة
- 🎯 **إدارة المنتجات**: إضافة، تعديل، حذف المنتجات
- 📝 **إدارة التقييمات**: مراجعة وقبول تقييمات العملاء
- 📈 **تتبع النقرات**: إحصائيات مشاهدة المنتجات ونقرات واتساب
- 🖼️ **رفع الصور**: نظام رفع صور متقدم
- 👥 **إدارة المستخدمين**: نظام أذونات متقدم

## التقنيات المستخدمة

### Frontend
- **Next.js 14**: إطار عمل React للتطبيقات الحديثة
- **Tailwind CSS**: مكتبة CSS للتصميم السريع
- **tailwindcss-rtl**: دعم التخطيط من اليمين لليسار
- **Lucide React**: مكتبة الأيقونات
- **React Hook Form**: إدارة النماذج
- **React Query**: إدارة حالة الخادم
- **Axios**: HTTP client للاتصال بالـ API

### Backend
- **Node.js**: بيئة تشغيل JavaScript
- **Express.js**: إطار عمل خادم الويب
- **MongoDB**: قاعدة البيانات NoSQL
- **Mongoose**: ODM لـ MongoDB
- **JWT**: المصادقة والتخويل
- **Multer**: رفع الملفات
- **Bcrypt**: تشفير كلمات المرور
- **Helmet**: حماية أمنية للخادم

## هيكل المشروع

```
arabic-clay-store/
├── client/                 # موقع العملاء (Next.js)
│   ├── pages/             # صفحات الموقع
│   ├── components/        # مكونات React
│   ├── styles/           # ملفات التصميم
│   └── public/           # الملفات العامة
├── admin-dashboard/       # لوحة التحكم (Next.js)
│   ├── pages/            # صفحات لوحة التحكم
│   ├── components/       # مكونات الإدارة
│   ├── contexts/         # Context للمصادقة
│   └── utils/           # أدوات مساعدة
├── server/               # الخادم (Express.js)
│   ├── models/          # نماذج قاعدة البيانات
│   ├── routes/          # مسارات API
│   ├── middleware/      # وسطيات الحماية
│   ├── controllers/     # منطق التحكم
│   └── uploads/         # ملفات الصور المرفوعة
└── README.md            # هذا الملف
```

## التثبيت والتشغيل

### خيارات التشغيل

يمكنك تشغيل المشروع بطريقتين:

#### 🐳 الطريقة الأولى: Docker (مستحسنة)
- Docker Desktop أو Docker Engine
- 4GB RAM متاحة
- 10GB مساحة تخزين

#### 🛠️ الطريقة الثانية: التثبيت المحلي
- Node.js (النسخة 16 أو أحدث)
- MongoDB (محلي أو سحابي)
- npm أو yarn

### 🐳 التثبيت باستخدام Docker (الطريقة المستحسنة)

#### 🪟 لمستخدمي Windows

**⚡ نشر بنقرة واحدة:**
```cmd
# انتقل لمجلد المشروع
cd "C:\path\to\arabic-clay-store"

# تشغيل فحص النظام التلقائي
pre-flight-check.bat

# سيبدأ عملية النشر المحسنة تلقائياً
```

**📖 أدلة Windows الشاملة:**
- **البدء السريع**: [`QUICK-START-WINDOWS.md`](./QUICK-START-WINDOWS.md)
- **الدليل الكامل**: [`COMPLETE-WINDOWS-DEPLOYMENT.md`](./COMPLETE-WINDOWS-DEPLOYMENT.md)
- **إعدادات الأمان**: [`SECURITY-CONFIG.md`](./SECURITY-CONFIG.md)

**🛠️ أدوات Windows المتاحة:**
- `pre-flight-check.bat` - فحص توافق النظام
- `DEPLOY-WINDOWS-ENHANCED.bat` - نشر محسن مع المراقبة
- `DEPLOY-WINDOWS.bat` - نشر بسيط (قديم)

#### 🐧 لمستخدمي Linux/Mac

```bash
# استنساخ المشروع
git clone <repository-url>
cd arabic-clay-store

# تشغيل الإعداد التلقائي
chmod +x docker-setup.sh
./docker-setup.sh
```

#### 🔧 النشر اليدوي

```bash
# للإنتاج
npm run docker:prod

# للتطوير (مع hot reload)
npm run docker:dev

# لمشاهدة السجلات
npm run docker:logs
```

#### 🌐 الوصول للتطبيق
- **الموقع العام**: http://localhost:3000
- **لوحة التحكم**: http://localhost:3001  
- **API**: http://localhost:5000
- **🔑 الدخول الافتراضي**: admin / admin123 (يجب تغييره!)

📖 **للتفاصيل الكاملة**: 
- Windows: [`COMPLETE-WINDOWS-DEPLOYMENT.md`](./COMPLETE-WINDOWS-DEPLOYMENT.md)
- Linux/Mac: [`DOCKER.md`](./DOCKER.md)

### 🛠️ التثبيت المحلي (التقليدي)

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd arabic-clay-store
```

2. **تثبيت التبعيات الرئيسية**
```bash
npm install
```

3. **تثبيت تبعيات الخادم**
```bash
cd server
npm install
```

4. **تثبيت تبعيات موقع العملاء**
```bash
cd ../client
npm install
```

5. **تثبيت تبعيات لوحة التحكم**
```bash
cd ../admin-dashboard
npm install
```

6. **إعداد متغيرات البيئة**
```bash
cd ../server
# انسخ ملف الإعدادات المثال وعدل القيم
cp config/env.example.js .env
```

متغيرات البيئة المطلوبة:
```env
MONGODB_URI=mongodb://localhost:27017/arabic-clay-store
JWT_SECRET=your-secret-key
PORT=5000
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
WHATSAPP_NUMBER=201234567890
```

7. **تشغيل قاعدة البيانات**
```bash
# تأكد من تشغيل MongoDB
mongod
```

8. **تشغيل جميع الخدمات**
```bash
# من المجلد الرئيسي
npm run dev
```

أو تشغيل كل خدمة منفصلة:
```bash
# الخادم
cd server && npm run dev

# موقع العملاء
cd client && npm run dev

# لوحة التحكم
cd admin-dashboard && npm run dev
```

## الوصول للتطبيق

بعد التشغيل، ستكون الخدمات متاحة على:

- **موقع العملاء**: http://localhost:3000
- **لوحة التحكم**: http://localhost:3001
- **API الخادم**: http://localhost:5000

## الإعداد الأولي

### إنشاء حساب المدير الأول

1. افتح لوحة التحكم: http://localhost:3001
2. ستظهر صفحة الإعداد الأولي
3. أدخل بيانات المدير:
   - الاسم الكامل
   - اسم المستخدم
   - البريد الإلكتروني
   - كلمة المرور
4. اضغط "إنشاء حساب المدير"

### إضافة منتجات أولية

1. سجل دخول لوحة التحكم
2. اذهب إلى "المنتجات" → "إضافة منتج جديد"
3. أدخل بيانات المنتج:
   - الاسم (بالعربية)
   - الوصف (بالعربية)
   - السعر (مثل: "ابتداءً من 75 جنيه")
   - الفئة
   - الصور
4. احفظ المنتج

## تخصيص الإعدادات

### تحديث رقم الواتساب

في ملف `.env`:
```env
WHATSAPP_NUMBER=201234567890  # أدخل رقمك بدون +
```

في ملفات الكود:
- `client/components/WhatsAppFloat.js`
- `client/pages/index.js`
- `client/pages/products.js`
- `client/pages/custom-order.js`

### تحديث معلومات التواصل

في ملف `client/pages/contact.js`:
```javascript
const whatsappNumber = "201234567890"
const facebookMessenger = "amali.bilteen"
const instagramUsername = "amali_bilteen"
const facebookPage = "amali.bilteen"
const tiktokUsername = "amali.bilteen"
```

### تخصيص الألوان والتصميم

في ملفات `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // ألوان المتجر الأساسية
  },
  clay: {
    // ألوان الطين
  }
}
```

## API Reference

### Authentication
- `POST /api/auth/setup` - إعداد المدير الأول
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - معلومات المستخدم الحالي
- `POST /api/auth/logout` - تسجيل الخروج

### Products
- `GET /api/products` - جلب المنتجات (عام)
- `GET /api/products/featured` - المنتجات المميزة
- `POST /api/products` - إضافة منتج (إداري)
- `PUT /api/products/:id` - تحديث منتج (إداري)
- `DELETE /api/products/:id` - حذف منتج (إداري)

### Reviews
- `GET /api/reviews` - جلب التقييمات المعتمدة
- `POST /api/reviews` - إضافة تقييم جديد
- `PUT /api/reviews/:id/approve` - قبول تقييم (إداري)
- `DELETE /api/reviews/:id` - حذف تقييم (إداري)

### Upload
- `POST /api/upload/single` - رفع صورة واحدة
- `POST /api/upload/multiple` - رفع عدة صور
- `DELETE /api/upload/:filename` - حذف صورة

## الحماية والأمان

### الحماية المطبقة
- تشفير كلمات المرور باستخدام bcrypt
- JWT tokens للمصادقة
- Rate limiting لمنع الهجمات
- Helmet لحماية Headers
- CORS محدود للنطاقات المصرح بها
- تشفير HTTPS في الإنتاج

### توصيات الأمان
1. **غيّر JWT_SECRET** في الإنتاج لقيمة عشوائية قوية
2. **استخدم HTTPS** في الإنتاج
3. **حدّث كلمات المرور** بانتظام
4. **فعّل النسخ الاحتياطي** لقاعدة البيانات
5. **راقب السجلات** للأنشطة المشبوهة

## 🐳 أوامر Docker المفيدة

### تشغيل الخدمات
```bash
# تشغيل بيئة الإنتاج
npm run docker:prod

# تشغيل بيئة التطوير
npm run docker:dev

# إيقاف جميع الخدمات
npm run docker:stop
```

### مراقبة الخدمات
```bash
# عرض السجلات
npm run docker:logs

# عرض حالة الخدمات
docker-compose ps

# فحص استخدام الموارد
docker stats
```

### إدارة البيانات
```bash
# نسخ احتياطية لقاعدة البيانات
docker exec arabic_clay_mongodb mongodump --out /backup

# الوصول لقاعدة البيانات
docker exec -it arabic_clay_mongodb mongosh -u admin -p admin123

# إعادة تشغيل خدمة معينة
docker-compose restart server
```

### تنظيف النظام
```bash
# تنظيف أساسي
npm run docker:clean

# تنظيف شامل (حذف الصور والمجلدات)
docker system prune -a
docker volume prune
```

## النشر (Deployment)

### متطلبات الخادم
- Node.js 16+
- MongoDB
- Nginx (مستحسن)
- SSL Certificate

### متغيرات الإنتاج
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-secret
CLIENT_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
```

### خطوات النشر
1. **رفع الكود** إلى الخادم
2. **تثبيت التبعيات**: `npm install --production`
3. **بناء التطبيقات**: `npm run build`
4. **إعداد Nginx** كـ reverse proxy
5. **إعداد PM2** لإدارة العمليات
6. **إعداد SSL Certificate**

## الدعم الفني

### الأخطاء الشائعة

**خطأ الاتصال بقاعدة البيانات**
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**الحل**: تأكد من تشغيل MongoDB

**خطأ CORS**
```bash
Access to fetch blocked by CORS policy
```
**الحل**: تأكد من إعداد CLIENT_URL و ADMIN_URL في متغيرات البيئة

**خطأ JWT**
```bash
JsonWebTokenError: invalid token
```
**الحل**: تأكد من JWT_SECRET أو امسح cookies المتصفح

### سجلات النظام
- سجلات الخادم: `server/logs/`
- سجلات MongoDB: حسب إعداد MongoDB
- سجلات Nginx: `/var/log/nginx/`

## المساهمة

### إضافة ميزات جديدة
1. انشئ فرع جديد: `git checkout -b feature/new-feature`
2. قم بالتغييرات المطلوبة
3. اختبر التغييرات
4. ارسل pull request

### تقرير الأخطاء
استخدم نظام Issues لتقرير الأخطاء مع:
- وصف مفصل للخطأ
- خطوات إعادة الإنتاج
- لقطات شاشة (إن وجدت)
- معلومات البيئة

## الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE).

## معلومات إضافية

### الدعم المتعدد اللغات
حالياً يدعم المشروع العربية فقط، لكن يمكن إضافة لغات أخرى بسهولة عبر:
- إضافة ملفات الترجمة
- تحديث إعدادات Next.js i18n
- تحديث Tailwind RTL

### ميزات مستقبلية محتملة
- [ ] نظام الدفع الإلكتروني
- [ ] إشعارات البريد الإلكتروني
- [ ] تتبع الطلبات
- [ ] برنامج نقاط الولاء
- [ ] تطبيق جوال
- [ ] تكامل مع مواقع التواصل الاجتماعي
- [x] **نشر Docker** (مكتمل)

---

**تم إنشاء هذا المشروع بحب لدعم الحرفيين العرب وأصحاب الأعمال الصغيرة** ❤️

للدعم الفني أو الاستفسارات، يرجى فتح issue في المستودع.