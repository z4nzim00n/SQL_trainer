# Теория: поиск строк без пары

Нужны строки левой таблицы, для которых справа ничего не нашлось. Два приёма.

**`LEFT JOIN ... IS NULL`:**

```sql
SELECT b.user_id
FROM balance b
LEFT JOIN "user" u ON u.id = b.user_id
WHERE u.id IS NULL;
```

**`NOT EXISTS`:**

```sql
SELECT b.user_id
FROM balance b
WHERE NOT EXISTS (SELECT 1 FROM "user" u WHERE u.id = b.user_id);
```

Валюты в `currency` повторяются, поэтому справа сначала нужна одна строка на `id` (`SELECT DISTINCT id FROM currency`), иначе левые строки размножатся.

Текст проблемы собирается через `CASE WHEN ... THEN ... END`. Уникальные строки даёт `DISTINCT`.

Ключевые слова для примеров: `LEFT JOIN`, `NOT EXISTS`, `CASE`, `DISTINCT`.
