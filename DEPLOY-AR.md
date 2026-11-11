# خطوات النشر على خادم VPS (Docker + Caddy)

> **لم تُختبر هذه الخطوات على خادم حقيقي** — اختُبر التطبيق نفسه على بناء إنتاج محلي، أما Docker وCaddy فلم يكونا متاحَين في بيئة الاختبار. اتبع الخطوات على نسخة تجريبية أولاً.

## المتطلبات
- خادم Ubuntu 22.04+ بعنوان IP عام، منفذان مفتوحان: 80 و443.
- سجل DNS من النوع A: `istanbul.norvigate.com` → عنوان الخادم (يجب أن ينتشر قبل التشغيل ليُصدر Caddy شهادة HTTPS).
- تثبيت Docker وDocker Compose: `curl -fsSL https://get.docker.com | sh`

## 1) رفع الشيفرة
```
scp istanbul-gate-final.zip user@SERVER:/opt/
ssh user@SERVER
cd /opt && unzip istanbul-gate-final.zip && cd app
```

## 2) الإعداد
```
cp .env.example .env
nano .env        # راجع NEXT_PUBLIC_SITE_URL و SITE_DOMAIN. اترك NORVIGATE_ALLOW_INDEXING=false
```

## 2.5) مجلد المحتوى
المجلد `content/` على الخادم يُركَّب داخل الحاوية: عدّل ملفاته أو أضف إليه دون إعادة بناء (انظر CONTENT-AR.md).

## 3) التشغيل
```
docker compose up -d --build
docker compose ps
curl -s https://istanbul.norvigate.com/api/health      # يجب أن يعيد {"ok":true}
```

## 4) الفحص بعد النشر (ضروري)
- افتح /ar و/en و/tr و/es و/fr، وجرّب نموذج الاتصال: يجب أن يظهر رقم مرجعي NV-...
- افتح /ar/tools: راقب الطقس وأسعار الصرف (يحتاجان اتصال الخادم والمتصفح بالإنترنت). إن عملا فغيّر حالة "الأدوات" في src/data/roadmap.json من beta إلى live وأعد البناء.
- شاهد الرؤوس: `curl -sI https://istanbul.norvigate.com/en | grep -i content-security`

## 5) قراءة الطلبات
```
docker compose exec app node -e "console.log(require('fs').readFileSync('/data/submissions/contact.jsonl','utf8'))"
```
ويمكن ضبط NORVIGATE_NOTIFY_WEBHOOK لإشعار فوري (لا يحمل بيانات شخصية).

## 6) النسخ الاحتياطي (الطلبات في وحدة التخزين nv-data)
```
docker run --rm -v app_nv-data:/data -v $PWD:/backup alpine tar czf /backup/nv-data-$(date +%F).tgz -C /data .
```
(اسم الوحدة يبدأ باسم المجلد: تحقق بـ `docker volume ls`.)

## 7) التحديث والرجوع
```
unzip -o النسخة-الجديدة.zip && docker compose up -d --build     # تحديث
docker compose down                                               # إيقاف (البيانات باقية في الوحدة)
```

## 8) الفهرسة (ما هي ومتى تُفعَّل)
الفهرسة تعني أن تُدرج محركات البحث (غوغل وغيره) صفحات موقعك في نتائجها، وهي الطريقة الأساسية لأن يجدك السائح أو المستثمر بالبحث دون إعلان. وهي معطّلة افتراضياً لئلا تُفهرَس نسخ تجريبية أو غير نهائية، وما يُفهرَس يصعب سحبه من نتائج البحث سريعاً.
عند التفعيل (`NORVIGATE_ALLOW_INDEXING=true` ثم `docker compose up -d --build`) تُفهرَس الصفحات الجاهزة فقط؛ أما كل ما وسمه `sample` (مزوّدون ومنتجات تجريبية) وصفحتا البحث والسلة فتبقى خارج الفهرسة وخارج خريطة الموقع تلقائياً. أي أن تفعيلها عند الإطلاق آمن، وكل سجل حقيقي تضيفه يصير قابلاً للفهرسة بمجرد وسمه `verified`.

## ما لا يغطيه هذا الدليل
حدّ المعدّل داخل الذاكرة فقط (يُصفَّر عند إعادة التشغيل)؛ للإنتاج الجاد أضف حداً على مستوى WAF/Caddy. لا توجد قاعدة بيانات: التخزين ملفات JSON على وحدة دائمة.
