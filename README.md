# فروشگاه آنلاین

یک فروشگاه آنلاین کامل با React + Spring Boot + SQLite

## Stack

| بخش | تکنولوژی |
|-----|----------|
| Frontend | React 18 + TypeScript + Tailwind CSS + Framer Motion |
| Backend | Java 17 + Spring Boot 3 |
| Database | SQLite |
| Auth | JWT + OTP موبایل |
| State | Zustand |
| i18n | i18next (فارسی/انگلیسی) |

## اجرای پروژه

### Backend

```bash
cd backend
mvn spring-boot:run
```

سرور روی پورت `8080` اجرا می‌شود.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

رابط کاربری روی `http://localhost:3000` باز می‌شود.

## ساختار پروژه

```
├── backend/
│   └── src/main/java/com/shop/
│       ├── entity/          # JPA Entities
│       ├── repository/      # Spring Data Repos
│       ├── service/         # Business Logic
│       ├── controller/      # REST Controllers
│       ├── security/        # JWT + Filter
│       └── config/          # Spring Configs
│
└── frontend/
    └── src/
        ├── api/             # Axios + API calls
        ├── components/      # Reusable components
        ├── layouts/         # Page layouts
        ├── pages/           # Route pages
        │   └── admin/       # Admin panel pages
        ├── store/           # Zustand stores
        ├── types/           # TypeScript types
        └── i18n/            # fa.json / en.json
```

## فیچرها

### فروشگاه عمومی
- صفحه اصلی با اسلایدر بنر
- لیست محصولات با فیلتر دسته‌بندی و جستجو
- صفحه جزئیات محصول
- سبد خرید persistent
- checkout با اطلاعات گیرنده
- سیستم پرداخت (زرین‌پال / آیدی‌پی)
- پیگیری سفارشات
- پروفایل کاربری
- ورود با OTP موبایل
- دو زبانه (فارسی/انگلیسی)

### پنل ادمین
- داشبورد با آمار کلی
- مدیریت محصولات (CRUD + آپلود تصویر)
- مدیریت دسته‌بندی‌ها
- مدیریت سفارشات و تغییر وضعیت
- مدیریت کاربران و تغییر نقش
- مدیریت منو (هدر/فوتر)
- مدیریت بنرها
- تنظیمات کامل سایت:
  - اطلاعات سایت
  - تم و رنگ (live preview)
  - درگاه پرداخت
  - تنظیمات ارسال
  - تنظیمات پیامک
  - SEO

## ساخت اول ادمین

بعد از اجرای اول، از طریق API یا مستقیم در SQLite:

```sql
UPDATE users SET role = 'ADMIN' WHERE phone = '09xxxxxxxxx';
```

## تنظیم درگاه پرداخت

از پنل ادمین → تنظیمات → درگاه پرداخت، merchant ID یا API Key را وارد کنید.

## OTP در محیط توسعه

در حالت dev، کد OTP در console/log سرور چاپ می‌شود. برای production باید SMS provider را در تنظیمات پیکربندی کنید.
