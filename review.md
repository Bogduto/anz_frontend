# Code Review — anz-frontend

> Дата: 2026-05-27  
> Гілка: `dev`  
> Перевірено: весь вихідний код у `src/`

---

## 🔴 Критичні помилки (збій / runtime error)

### 1. `RepositoryStats.tsx:163` — змінна `response` не існує
`ScheduleChart` викликається з пропом `response={response}`, але змінна `response` ніде не оголошена (весь fetch-код закоментований). Це призводить до помилки компіляції TypeScript / runtime crash.
```tsx
// Зламаний рядок:
<ScheduleChart response={response} />
// ScheduleChart не приймає проп `response`, він очікує `days` та `sessions`
```

### 2. `RepositoryList.tsx:43-45` — помилкова обробка error-стану
`fetchRepositories()` при помилці повертає об'єкт `{ error: string, message: string }`, а не `null`/`undefined`. Тому перевірка `if (!repositories)` ніколи не спрацює на помилку — об'єкт є truthy. Далі викликається `repositories.length`, що поверне `undefined`, а `repositories.map` кине виняток.
```tsx
const repositories = await fetchRepositories() as Workspace[]; // небезпечний cast
if (!repositories) return <div>something went wrong</div>; // ніколи не спрацює при error-об'єкті
if (repositories.length === 0) { ... } // undefined для об'єкту помилки
```

### 3. `WeeklyDatePicker.tsx` — відсутня обгортка `<Suspense>`
`useSearchParams()` у Next.js App Router вимагає обгортки `<Suspense>` в батьківському компоненті. У `RepositoryDetailPage` компонент викликається без Suspense, що спричиняє помилку білду або гідратації.
```tsx
// src/app/(private)/repositories/[id]/page.tsx
<WeeklyDatePicker /> // немає <Suspense> навколо
```

### 4. `auth/api/callback/route.ts:31` — редирект на неіснуючу сторінку
При невдалій авторизації сервер робить редирект на `/auth/auth-code-error`, але такої сторінки в проекті не існує. Користувач побачить сторінку 404.

---

## 🟠 Серйозні баги

### 5. `auth/page.tsx:13` — `signInWithOAuth` не await-ується
Виклик не є `await`-нутим, тому помилки OAuth не будуть перехоплені блоком `try/catch`. Якщо авторизація завалиться, користувач не отримає жодного повідомлення.
```tsx
supabase.auth.signInWithOAuth({ ... }); // має бути: await supabase.auth.signInWithOAuth(...)
```

### 6. `RepositoryDetailPage` — "Today activities" показує дані не за сьогодні
Секція підписана "Today activities", але насправді показує дані за дату з `?start=` URL-параметра, яка може бути будь-яким днем. Назва вводить користувача в оману.

### 7. `RepositoryDetailPage:48` — береться лише перша активність дня
```tsx
const dayActivities = stats.weekStats.days?.[dayKey]?.[0]; // тільки [0]
```
Якщо за обраний день є декілька активностей, сесії та файли відображаються тільки для першої з них. Решта ігнорується.

### 8. `ScheduleChart.tsx:26` — `tsToMinutes` використовує локальний час замість UTC
Коментар у коді каже "UTC", але функція використовує `getHours()` (локальний час) замість `getUTCHours()`. Це несумісно з `todayHightling.ts`, який використовує UTC. При розбіжності часового поясу бари активностей відображатимуться зі зсувом.
```tsx
function tsToMinutes(ts: number) {
  const d = new Date(ts);
  return d.getHours() * 60 + d.getMinutes(); // має бути getUTCHours(), getUTCMinutes()
}
```

### 9. `RepositoryList.tsx` — помилка в `fetchRepositories` тихо ковтається
Блок `catch` лише `console.log`-ує помилку та повертає `undefined`. Користувач не отримає інформативного повідомлення, а стан помилки обробляється некоректно (див. пункт №2).

---

## 🟡 Проблеми з кодом / якістю

### 10. `RepositoryStats.tsx` — компонент повністю зламаний та, схоже, не використовується
Весь код отримання даних закоментований, параметри компонента закоментовані. Компонент рендерить порожню секцію "Today" та зламаний `ScheduleChart`. Компонент не імпортується ніде в активному коді.

### 11. `auth/page.tsx:52-55` — debug-текст у production
```tsx
<p>
  This is a mock GitHub authentication screen. Wire this button up to
  your real GitHub OAuth / NextAuth configuration when you are ready.
</p>
```
Цей текст відображається кінцевому користувачу.

### 12. `auth/page.tsx:7` — `useUser` викликається, але результат не використовується
```tsx
const user = useUser(); // результат ніде не використовується
```
Хук робить зайвий мережевий запит без будь-якої користі.

### 13. `WeeklyDatePicker.tsx:56` — debug-рядок у форматі дати
```tsx
return `range ${start.format(DISPLAY_FORMAT)} - ${end.format(DISPLAY_FORMAT)} choosen ${startParam}`;
//                                                                   ^^^^^^^ орфографічна помилка
//                                                                   та debug-значення `startParam`
```
Слово "choosen" замість "chosen", а `startParam` — це залишок дебагу.

### 14. `WeeklyDatePicker.tsx:28-30` — `onClear` нічого не робить
```tsx
const onClear = () => {
  return dayjs(); // просто повертає значення, нічого не оновлює
};
```
Функція не передана до `DatePicker`'s `onClear` пропу і не оновлює URL.

### 15. `repository/[id]/page.tsx:55` — `console.log` у production коді
```tsx
console.log("state:", stats);
```

### 16. `FilesChart.tsx:89` — `console.log` у production коді
```tsx
console.log("Most used files chart data:", chartData);
```

### 17. `RepositoryDetailPage` — `<h2>` стилізований як посилання, але не є посиланням
```tsx
<h2 className="cursor-pointer text-sm font-light text-black/50 underline">
  {stats.workspace.href}
</h2>
```
Елемент виглядає як клікабельне посилання (cursor-pointer, underline), але натискання нічого не робить. Погана UX і доступність.

### 18. `LogoutButton.tsx:11` — використовується `window.location.href` замість роутера Next.js
```tsx
window.location.href = "/landing"; // повна перезавантаження сторінки
```
Має використовуватись `useRouter().push('/landing')` для клієнтської навігації.

### 19. `providers.tsx:29` — ReactQueryDevtools у production
```tsx
<ReactQueryDevtools initialIsOpen={false} />
```
DevTools надсилаються в production без перевірки `NODE_ENV`. Має бути обгорнутим:
```tsx
{process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
```

### 20. `FilesChart.tsx:137-141` — мертвий код (dead code)
```tsx
{chartData.length === 0 && (
  <div>No file usage data available for this day.</div>
)}
```
Ця перевірка всередині списку ніколи не виконається, бо компонент вже робить ранній return при `chartData.length === 0` на рядку 91.

### 21. `formatTimeDuration.ts:12` — некоректне форматування хвилин
```tsx
return `${Math.floor(dayjs.duration(duration).asMinutes()).toFixed(1)} minutes`;
```
`Math.floor()` повертає ціле число, після якого `.toFixed(1)` додає зайве ".0". Наприклад: "5.0 minutes" замість "5 minutes". Методи взаємно суперечать одне одному.

### 22. `RepositoryList.tsx:64` — порожній `<span>` в кожній картці репозиторія
```tsx
<span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 ...">
  {/* {repo.status} */}
</span>
```
Порожній badge рендериться в UI (видиме порожнє місце зі стилями).

---

## 🔵 Архітектурні та структурні проблеми

### 23. `lib/supabase/supabase.ts` — дублювання Supabase клієнта
Існують два різні Supabase-клієнти:
- `lib/supabase/client.ts` — використовує `@supabase/ssr` (правильно для SSR + cookies)
- `lib/supabase/supabase.ts` — використовує `@supabase/supabase-js` напряму (не підтримує cookies/сесії)

Прямий клієнт не обробляє auth cookies і може призвести до помилок авторизації на сервері.

### 24. `api/dto/workspaceDTO.ts` — невикористана та неекспортована функція
`fromWorkspaceDTO` оголошена, але не `export`ована і не використовується ніде в проекті. Мертвий код.

### 25. `ScheduleChart/tsToMinutes.ts` — порожній файл
Файл існує, але фактично порожній (1 рядок). Функція `tsToMinutes` дублюється безпосередньо в `ScheduleChart.tsx`. Файл слід або наповнити, або видалити.

### 26. `todayHightling.ts:1` — зайвий імпорт React
```tsx
import React from 'react' // ніде не використовується у цьому файлі
```

### 27. `useUser.ts:6` — тип `any` для стану користувача
```tsx
const [user, setUser] = useState<any>(null);
```
Має використовуватись `User` тип від `@supabase/supabase-js`.

### 28. `package.json` — `clsx` відсутній у `dependencies`
`src/utils/cn.ts` імпортує `clsx`, але цей пакет не перелічений у `package.json`. Проект залежить від нього неявно.

### 29. `getColor.ts` — кольори прив'язані лише до 4 workspace ID
Словник `WORKSPACE_COLORS` містить лише ID 1-4. Будь-який `workspace_id` > 4 отримає сірий fallback-колір, що унеможливить візуальне розрізнення більше 4 проектів.

### 30. `lib/data.ts` та `lib/stats.ts` — невикористаний legacy-код
Файли містять стару логіку, що опирається на JSON-файли (`sessions.json`, `slices.json` тощо) замість Supabase. Ця логіка не використовується в жодному активному маршруті. Збільшує розмір bundle та вносить плутанину.

---

## 🎨 UX / Design проблеми

### 31. `ScheduleChart.tsx` — відсутня підтримка dark mode
Компонент використовує хардкодні класи `bg-white`, `bg-gray-50/60`, `border-gray-100` без `dark:` варіантів. Вся інша частина додатку підтримує темну тему, а графік залишається білим.

### 32. `ScheduleChart.tsx` — немає повідомлення при відсутності даних
Якщо об'єкт `days` порожній, графік рендерить пусту сітку без будь-якого повідомлення для користувача ("Немає активностей за цей тиждень" тощо).

### 33. `ScheduleChart.tsx` — немає авто-прокрутки до поточного часу
При завантаженні графік показує початок дня (00:00). Немає кнопки "Перейти до зараз" і немає авто-прокрутки до поточного часу.

### 34. `MostVisitedFilesChart.tsx` — pie chart без tooltip, legend та підписів
Кругова діаграма не має підказок при наведенні, легенди та підписів до секторів. Користувач не може ідентифікувати сектори без додаткового списку збоку.

### 35. `FilesChart.tsx` та `MostVisitedFilesChart.tsx` — не адаптивний дизайн
```tsx
<div className="w-[500px]">  // фіксована ширина
<PieChart width={400} height={400}>  // фіксовані розміри
```
На мобільних/вузьких екранах графік виходить за межі контейнера.

### 36. `layout.tsx` — хедер не є sticky
Хедер має напівпрозорий фон із `backdrop-blur-sm`, що візуально натякає на sticky-поведінку, але класи `sticky` або `fixed` відсутні. Хедер прокручується разом зі сторінкою.

### 37. `RepositoryDetailPage` — мітка "Weekly activities" відображає час, а не кількість
```tsx
<h3>Weekly activities</h3>
<p>{formatTimeDuration(week_count)}</p>
```
Назва "activities" означає кількість подій, але відображається тривалість (наприклад "3.5 hours"). Або мітка, або значення некоректні.

---

## 📋 Зведена таблиця

| # | Файл | Тип | Серйозність |
|---|------|-----|-------------|
| 1 | `RepositoryStats.tsx:163` | Невизначена змінна `response` | 🔴 Критична |
| 2 | `RepositoryList.tsx:43` | Некоректна обробка error-об'єкта | 🔴 Критична |
| 3 | `WeeklyDatePicker.tsx` | Відсутній `<Suspense>` для `useSearchParams` | 🔴 Критична |
| 4 | `api/auth/callback/route.ts:31` | Редирект на неіснуючу сторінку | 🔴 Критична |
| 5 | `auth/page.tsx:13` | `signInWithOAuth` не await-ується | 🟠 Серйозна |
| 6 | `RepositoryDetailPage` | "Today activities" показує не сьогоднішній день | 🟠 Серйозна |
| 7 | `RepositoryDetailPage:48` | Береться лише перша активність дня | 🟠 Серйозна |
| 8 | `ScheduleChart.tsx:26` | Локальний час замість UTC | 🟠 Серйозна |
| 9 | `RepositoryList.tsx` | Помилка тихо ковтається в catch | 🟠 Серйозна |
| 10 | `RepositoryStats.tsx` | Компонент зламаний та невикористаний | 🟡 Середня |
| 11 | `auth/page.tsx:52` | Debug-текст у production | 🟡 Середня |
| 12 | `auth/page.tsx:7` | `useUser` викликається без потреби | 🟡 Середня |
| 13 | `WeeklyDatePicker.tsx:56` | Debug-рядок у форматі дати | 🟡 Середня |
| 14 | `WeeklyDatePicker.tsx:28` | `onClear` нічого не робить | 🟡 Середня |
| 15 | `repository/[id]/page.tsx:55` | `console.log` у production | 🟡 Середня |
| 16 | `FilesChart.tsx:89` | `console.log` у production | 🟡 Середня |
| 17 | `RepositoryDetailPage` | `<h2>` як фейкове посилання | 🟡 Середня |
| 18 | `LogoutButton.tsx:11` | `window.location.href` замість роутера | 🟡 Середня |
| 19 | `providers.tsx:29` | DevTools в production | 🟡 Середня |
| 20 | `FilesChart.tsx:137` | Мертвий код (dead code) | 🟡 Середня |
| 21 | `formatTimeDuration.ts:12` | Некоректне форматування хвилин | 🟡 Середня |
| 22 | `RepositoryList.tsx:64` | Порожній `<span>` badge в кожній картці | 🟡 Середня |
| 23 | `lib/supabase/supabase.ts` | Дублювання Supabase клієнта | 🔵 Архітектурна |
| 24 | `api/dto/workspaceDTO.ts` | Невикористана функція | 🔵 Архітектурна |
| 25 | `ScheduleChart/tsToMinutes.ts` | Порожній файл | 🔵 Архітектурна |
| 26 | `todayHightling.ts:1` | Зайвий `import React` | 🔵 Архітектурна |
| 27 | `useUser.ts:6` | Тип `any` для user | 🔵 Архітектурна |
| 28 | `package.json` | `clsx` відсутній у dependencies | 🔵 Архітектурна |
| 29 | `getColor.ts` | Кольори лише для 4 workspace | 🔵 Архітектурна |
| 30 | `lib/data.ts`, `lib/stats.ts` | Невикористаний legacy-код | 🔵 Архітектурна |
| 31 | `ScheduleChart.tsx` | Немає dark mode | 🎨 UX |
| 32 | `ScheduleChart.tsx` | Немає стану "немає даних" | 🎨 UX |
| 33 | `ScheduleChart.tsx` | Немає прокрутки до поточного часу | 🎨 UX |
| 34 | `MostVisitedFilesChart.tsx` | Pie chart без tooltip/legend | 🎨 UX |
| 35 | `FilesChart.tsx` | Не адаптивний дизайн | 🎨 UX |
| 36 | `layout.tsx` | Хедер не sticky | 🎨 UX |
| 37 | `RepositoryDetailPage` | Мітка "Weekly activities" невідповідна | 🎨 UX |
