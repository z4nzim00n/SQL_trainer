# Задание 00. LEFT JOIN и поиск «без пары»

Раньше такое решалось через `NOT IN` или `NOT EXISTS`, но здесь они запрещены. Есть приём на `LEFT JOIN`.

`LEFT JOIN` оставляет **все** строки левой таблицы. Если для строки нет пары справа, то столбцы правой таблицы в ней будут `NULL`. Поэтому «строки левой таблицы без пары» это строки, где столбец правой таблицы равен `NULL`:

```sql
FROM левая
LEFT JOIN правая ON связь
WHERE правая.id IS NULL
```

Проверять нужно столбец, который в настоящей паре никогда не бывает `NULL` (обычно `id` правой таблицы). Проверка на `NULL` делается через `IS NULL`, а не через `= NULL`.

Условие `WHERE` выполняется **после** соединения, поэтому оно и отбрасывает строки с парой.

## Примеры на маленьких таблицах

Курсы без студентов:

```sql-run
SELECT courses.title
FROM courses
LEFT JOIN students ON students.course_id = courses.id
WHERE students.id IS NULL;
```

Что видно до отбора: у курса Art справа сплошные `NULL`:

```sql-run
SELECT courses.title, students.name
FROM courses
LEFT JOIN students ON students.course_id = courses.id
ORDER BY courses.title, students.name;
```
