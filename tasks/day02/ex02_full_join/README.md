# Задание 02. FULL значит «полностью заполнено»

**Разрешено:** ANSI SQL

**Запрещено:** `NOT IN`, `IN`, `NOT EXISTS`, `EXISTS`, `UNION`, `EXCEPT`, `INTERSECT`

Напиши запрос, который возвращает:

- **полный** список имён людей, посетивших (или не посетивших) пиццерии в период с 1 по 3 января 2022 года;
- **полный** список названий пиццерий, которые посещались (или не посещались) в тот же период.

Столбцы: `person_name`, `visit_date`, `pizzeria_name`. Для `NULL` в `person_name` и `pizzeria_name` подставь `'-'` (в `visit_date` остаётся настоящий `NULL`). Отсортируй по всем трём столбцам.

| person_name | visit_date | pizzeria_name |
| --- | --- | --- |
| - | null | DinoPizza |
| - | null | DoDo Pizza |
| Andrey | 2022-01-01 | Dominos |
| Andrey | 2022-01-02 | Pizza Hut |
| Anna | 2022-01-01 | Pizza Hut |
| Denis | null | - |
| Dmitriy | null | - |
| ... | ... | ... |
