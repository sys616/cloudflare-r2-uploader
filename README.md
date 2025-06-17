# Cloudflare R2 File Uploader

واجهة رفع ملفات عصرية إلى Cloudflare R2 مع دعم العربية والإنجليزية.

---

## 🇸🇦 تعليمات التثبيت (العربية)

1. **انسخ الملفات إلى استضافتك أو سيرفرك.**
2. **ثبت Composer** (إن لم يكن مثبتًا):
   - يمكنك تثبيته من [getcomposer.org](https://getcomposer.org/)
3. **ثبت الاعتمادات:**
   - في مجلد المشروع، شغل:
     ```bash
     composer install
     ```
4. **ضبط الإعدادات:**
   - انسخ ملف `.env.example` إلى `.env` وعدل القيم:
     ```env
     AWS_ACCESS_KEY_ID=your-access-key-id    # مفتاح الوصول
     AWS_SECRET_ACCESS_KEY=your-secret-access-key    # المفتاح السري
     AWS_DEFAULT_REGION=auto    # المنطقة (عادة auto)
     AWS_BUCKET=your-bucket-name    # اسم البكت
     AWS_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com    # نقطة النهاية
     PUBLIC_BUCKET_URL=https://your-public-domain.com    # رابط البكت العام
     ```
5. **تأكد من أن مجلد `vendor` موجود** (ناتج عن composer install)
6. **شغل الموقع من متصفحك واستمتع!**

---

## 🇬🇧 Installation Instructions (English)

1. **Copy the files to your hosting/server.**
2. **Install Composer** (if not installed):
   - Get it from [getcomposer.org](https://getcomposer.org/)
3. **Install dependencies:**
   - In the project folder, run:
     ```bash
     composer install
     ```
4. **Configure environment:**
   - Copy `.env.example` to `.env` and edit the values:
     ```env
     AWS_ACCESS_KEY_ID=your-access-key-id    # Access Key ID
     AWS_SECRET_ACCESS_KEY=your-secret-access-key    # Secret Access Key
     AWS_DEFAULT_REGION=auto    # Region (usually auto)
     AWS_BUCKET=your-bucket-name    # Bucket Name
     AWS_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com    # S3 Endpoint
     PUBLIC_BUCKET_URL=https://your-public-domain.com    # Public Bucket URL
     ```
5. **Ensure the `vendor` folder exists** (from composer install)
6. **Open the site in your browser and enjoy!**

---

### ⚠️ ملاحظات / Notes
- لا تشارك ملف `.env` مع أي شخص.
  - **Never share your `.env` file with anyone.**
- أدخل بيانات الاعتماد الخاصة بك فقط في ملف `.env`.
  - **Enter your credentials only in the `.env` file.**
- جميع البيانات الحساسة تم حذفها من المشروع.
  - **All sensitive data has been removed from the project.**
- يمكنك تخصيص التصميم أو اللغة بسهولة من خلال الملفات.
  - **You can easily customize the design or language through the files.**

---

بالتوفيق! / Good luck!
