# Задание 06. Цепочка JOIN с отбором по имени

Путь от человека к пицце: `person_order` → `person` (по имени человека) → `menu` (что) → `pizzeria` (где). Каждое звено это `JOIN ... ON`.

Отбор по имени ставится в `WHERE` после соединений: `person.name = 'Denis' OR person.name = 'Anna'`. Имена сравниваются с учётом регистра.

Если нужны только заказавшие, берите `person_order`: это таблица заказов. `person_visits` (посещения) здесь не подходит, человек мог зайти и ничего не заказать.

## Примеры на маленьких таблицах

```sql-run
SELECT students.name, courses.title
FROM students
JOIN courses ON students.course_id = courses.id
WHERE students.name = 'Ann' OR students.name = 'Cleo'
ORDER BY students.name;
```
