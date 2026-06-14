# Climate-life — bitta HTML + Supabase backend

Loyiha endi **bitta `index.html`** faylda: ommaviy sayt + admin panel birga.
Barcha ma'lumotlar (buyurtmalar, xizmatlar, ustalar, sharhlar, FAQ) **Supabase**da
saqlanadi — ya'ni mijoz yuborgan buyurtma istalgan qurilmadan admin panelda ko'rinadi.

## Fayllar
- `index.html` — to'liq sayt + admin panel (Supabase'ga ulanadi)
- `schema.sql` — Supabase ma'lumotlar bazasi sxemasi (jadvallar + xavfsizlik + standart ma'lumotlar)
- `photo_2026-06-13_19-56-02.jpg` — logotip rasmi

---

## 1-qadam. Supabase loyihasini yaratish
1. https://supabase.com → **Sign in** → **New project**
2. Loyiha nomi, parol va region tanlang → **Create new project** (1-2 daqiqa kutiladi)

## 2-qadam. Ma'lumotlar bazasini yaratish
1. Supabase'da chap menyudan **SQL Editor** → **New query**
2. `schema.sql` faylidagi BARCHA kodni nusxalab, oynaga joylang
3. **Run** tugmasini bosing — jadvallar va standart ma'lumotlar yaratiladi

## 3-qadam. Admin foydalanuvchi yaratish
1. Chap menyudan **Authentication** → **Users** → **Add user** → **Create new user**
2. Email va parol kiriting, **Auto Confirm User** yoqilgan bo'lsin → **Create**
3. Shu email/parol bilan saytda admin panelga kirasiz

## 4-qadam. Saytni Supabase'ga ulash
1. Chap menyudan **Project Settings** (tishli) → **API**
2. Quyidagilarni nusxa oling:
   - **Project URL** (masalan `https://abcd1234.supabase.co`)
   - **anon public** key (uzun matn)
3. `index.html` ni oching, JS boshidagi qatorlarni to'ldiring:
   ```js
   var SUPABASE_URL = 'https://abcd1234.supabase.co';   // o'zingiznikini qo'ying
   var SUPABASE_ANON_KEY = 'eyJ...';                     // anon public key
   ```
   > `anon` kalitni ochiq qo'yish xavfsiz — ma'lumotlar Row Level Security (RLS)
   > qoidalari bilan himoyalangan (`schema.sql` ichida).

## 5-qadam. Saytni joylash (deploy)
Eng oson varianti — **Netlify** yoki **Vercel** (ikkalasi ham bepul):

**Netlify:**
1. https://app.netlify.com → **Add new site** → **Deploy manually**
2. `index.html` va `photo_2026-06-13_19-56-02.jpg` fayllarini bir papkaga solib, papkani tashlang
3. Tayyor sayt manzili beriladi

**yoki lokal sinash:**
```bash
python3 -m http.server 8000
```
Keyin brauzerda `http://localhost:8000` ni oching.

---

## Admin panelga kirish
- Saytning pastki o'ng burchakdagi ⚙️ tugmasi, yoki footerdagi "Admin Panel" havolasi
- Yoki to'g'ridan-to'g'ri: `sayt-manzili/#admin`
- 3-qadamda yaratgan email/parol bilan kiring

## Nimalar ishlaydi
- Mijoz buyurtma yuboradi → Supabase `orders` jadvaliga tushadi
- Admin panelda buyurtmalar, holatni o'zgartirish, qidirish, filtr
- Xizmat / usta / sharh / FAQ qo'shish, tahrirlash, o'chirish — saytda darhol ko'rinadi
- Login Supabase Auth orqali (parol kodda saqlanmaydi)
