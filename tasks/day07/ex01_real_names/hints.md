## Идея

Внутри подзапроса: соедини посещения с людьми, сгруппируй, отсортируй по количеству (потом по имени) и возьми `LIMIT 4`. Снаружи отсортируй по имени.

## Каркас

```sql
SELECT name, count_of_visits
FROM (SELECT person.name, COUNT(*) AS count_of_visits
      FROM person_visits
      JOIN person ON person.id = person_visits.______
      GROUP BY person.id, person.name
      ORDER BY ______ DESC, person.name
      LIMIT ______) AS top
ORDER BY ______;
```

## Почти ответ

```sql
... ORDER BY count_of_visits DESC, person.name
      LIMIT 4) AS top
ORDER BY ______;
```

Осталась внешняя сортировка по имени.
