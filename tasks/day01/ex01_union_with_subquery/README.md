# Задание 01. UNION dance with subquery

**Разрешено:** ANSI SQL

Измени запрос из задания 00 так:

- удали столбец `object_id`;
- измени порядок сортировки: сначала данные из таблицы `person` (по `object_name`), затем из таблицы `menu` (тоже по `object_name`);
- сохрани дублирующиеся строки.

| object_name |
| --- |
| Andrey |
| Anna |
| ... |
| cheese pizza |
| cheese pizza |
| ... |
