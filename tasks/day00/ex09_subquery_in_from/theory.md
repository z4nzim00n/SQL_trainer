# Задание 09. Подзапрос в FROM

Подзапрос в `FROM` работает как временная таблица: сначала выполняется он, а внешний запрос уже читает его результат. **Псевдоним обязателен**: `FROM (SELECT ...) AS pv`, дальше к столбцам можно обращаться как `pv.person_id`.

Этим удобно сначала отобрать нужные строки (здесь посещения в нужные даты), а потом уже в `SELECT` добавить подзапросами имена из других таблиц, как в задании 05.

`ORDER BY` умеет сортировать по нескольким столбцам, у каждого своё направление: `ORDER BY a ASC, b DESC`. Сначала сортировка по первому, а при равных значениях по второму. По новым именам из `SELECT` (`AS person_name`) сортировать можно.

## Примеры на маленьких таблицах

Подзапрос в `FROM`:

```sql-run
SELECT young.name, young.age
FROM (SELECT name, age FROM students WHERE age < 22) AS young
ORDER BY young.age DESC;
```

Вместе с подзапросом в `SELECT`:

```sql-run
SELECT s.name,
       (SELECT title FROM courses WHERE courses.id = s.course_id) AS course
FROM (SELECT name, course_id FROM students WHERE course_id IS NOT NULL) AS s
ORDER BY course ASC, name DESC;
```
