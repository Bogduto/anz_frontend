# get_workspace_week_stats

Вставити у **Supabase → SQL Editor** і натиснути **Run**.

```sql
CREATE OR REPLACE FUNCTION itallo.get_workspace_week_stats(
  p_workspace_id bigint,
  p_date         date
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  week_start timestamptz;
  week_end   timestamptz;
  result     jsonb;
BEGIN
  week_start := date_trunc('week', p_date::timestamptz);
  week_end   := week_start + interval '7 days';

  WITH days AS (
    SELECT generate_series(
      week_start,
      week_end - interval '1 day',
      interval '1 day'
    ) AS day
  ),
  activities AS (
    SELECT *
    FROM itallo.activity
    WHERE workspace_id = p_workspace_id
      AND created_at >= week_start
      AND created_at <  week_end
  ),
  sessions AS (
    SELECT
      s.*,
      jsonb_build_object(
        'id',       f.id,
        'name',     f.name,
        'pathname', f.pathname,
        'language', f.language
      ) AS file
    FROM itallo.session s
    LEFT JOIN itallo.file f ON f.id = s.file_id
    -- фільтр тільки по сесіях які належать activities цього workspace
    WHERE s.activity_id IN (SELECT id FROM activities)
  ),
  grouped_days AS (
    SELECT
      d.day::date AS day,
      COALESCE(
        jsonb_agg(a) FILTER (WHERE a.id IS NOT NULL),
        '[]'::jsonb
      ) AS activities
    FROM days d
    LEFT JOIN activities a
      ON date_trunc('day', a.created_at) = d.day
    GROUP BY d.day
  ),
  grouped_sessions AS (
    SELECT
      activity_id,
      jsonb_agg(s) AS sessions
    FROM sessions s
    GROUP BY activity_id
  )
  SELECT jsonb_build_object(
    'days',
      (SELECT jsonb_object_agg(day, activities) FROM grouped_days),
    'sessions',
      (SELECT jsonb_object_agg(activity_id, sessions) FROM grouped_sessions),
    'workspace_total_spent',
      (
        SELECT COALESCE(SUM(total_duration), 0)
        FROM itallo.activity
        WHERE workspace_id = p_workspace_id
      )
  )
  INTO result;

  RETURN result;
END;
$$;
```

---

## Що змінилось відносно попередньої версії

| # | Що | До | Після |
|---|----|----|-------|
| 1 | Тип параметра `p_date` | `timestamp` | `date` — більше не залежить від timezone клієнта |
| 2 | Фільтр sessions | `where s.created_at >= week_start` (всі сесії за тиждень) | `where s.activity_id in (select id from activities)` — тільки сесії цього workspace |
| 3 | Конвертація дати | `date_trunc('week', p_date)` | `date_trunc('week', p_date::timestamptz)` — явний каст |

---

## Що передавати з фронту

Оскільки параметр тепер `date`, передавати треба рядок формату `YYYY-MM-DD`:

```ts
// src/app/(private)/repositories/[id]/fetchRepository.ts

const { data: weekStats, error } = await supabase
  .schema("itallo")
  .rpc("get_workspace_week_stats", {
    p_workspace_id: workspaceId,
    p_date: date.substring(0, 10), // "2026-05-27T..." → "2026-05-27"
  });
```

І в `page.tsx` також:

```ts
// src/app/(private)/repositories/[id]/page.tsx

const day = start
  ? new Date(start as string).toISOString().substring(0, 10)
  : new Date().toISOString().substring(0, 10);
```
