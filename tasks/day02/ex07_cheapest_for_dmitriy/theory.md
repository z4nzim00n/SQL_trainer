# Задание 07. Сквозная логика: посещение + меню

Условие склеивает два факта: «Дмитрий был в пиццерии» (`person_visits`) и «в этой пиццерии есть пицца дешевле 800» (`menu`). Они связаны через пиццерию: `person_visits.pizzeria_id = pizzeria.id` и `menu.pizzeria_id = pizzeria.id`.

Поэтому цепочка такая: `person_visits` → `person` (фильтр по имени), `person_visits` → `pizzeria`, `pizzeria` → `menu` (фильтр по цене). Условия на имя, дату и цену идут в `WHERE` через `AND`.

Строгое «дешевле 800» это `price < 800`, а не `<=`.

## Примеры на маленьких таблицах

```sql-run
SELECT students.name, courses.title
FROM students
JOIN courses ON students.course_id = courses.id
WHERE students.age < 22 AND courses.title = 'Math'
ORDER BY students.name;
```
