## Идея

Сделай две выборки названий пиццерий из посещений: для женщин и для мужчин. Вычти их друг из друга с сохранением повторов в обе стороны и сложи результаты через `UNION ALL`.

## Каркас

```sql
(SELECT <название пиццерии> FROM <посещения женщин>
 EXCEPT ALL
 SELECT <название пиццерии> FROM <посещения мужчин>)
UNION ALL
(... мужчины EXCEPT ALL женщины ...)
ORDER BY pizzeria_name;
```

Каждая выборка: `person_visits JOIN person ... JOIN pizzeria ... WHERE person.gender = '...'`.

## Почти ответ

```sql
(SELECT pizzeria.name AS pizzeria_name FROM person_visits JOIN person ON ... JOIN pizzeria ON ... WHERE person.gender = 'female'
 EXCEPT ALL
 SELECT pizzeria.name FROM ... WHERE person.gender = 'male')
UNION ALL
(______)
ORDER BY pizzeria_name;
```

Осталась вторая часть: то же, только пол поменяй местами.
