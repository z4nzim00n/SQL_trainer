## Идея

Сгруппируй посещения по имени человека, посчитай строки и оставь группы с числом больше трёх через `HAVING`.

## Каркас

```sql
SELECT person.name, COUNT(*) AS count_of_visits
FROM person_visits
JOIN person ON person.id = person_visits.person_id
GROUP BY ______
______ COUNT(*) > ______;
```

## Почти ответ

```sql
SELECT person.name, COUNT(*) AS count_of_visits
FROM person_visits
JOIN person ON person.id = person_visits.person_id
GROUP BY person.name
HAVING COUNT(*) > ______;
```

Осталось число из условия.
