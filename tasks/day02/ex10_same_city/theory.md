# Задание 10. Self join

Таблицу можно соединить **саму с собой**: берём одну и ту же таблицу дважды под разными псевдонимами (`person AS person1` и `person AS person2`) и сравниваем строки друг с другом. Псевдонимы здесь обязательны: иначе непонятно, какая копия имеется в виду.

Условие соединения: адреса совпадают (`person1.address = person2.address`). Но тогда в результате будет каждый человек в паре с самим собой и каждая пара дважды (`A, B` и `B, A`). Лишнее убирает условие `person1.id > person2.id`: оно оставляет одно направление и отбрасывает пары «сам с собой» (там `id` равны).

Названия столбцов переименовываются через `AS`, сортировка идёт по трём столбцам.

## Примеры на маленьких таблицах

```sql-run
SELECT first.name AS student1, second.name AS student2, first.city
FROM students AS first
JOIN students AS second ON first.city = second.city AND first.id > second.id
ORDER BY student1, student2;
```
