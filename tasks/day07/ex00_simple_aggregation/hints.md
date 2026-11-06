## Идея

Группируй посещения по человеку и считай строки в группе. Сортировка двухуровневая: по количеству по убыванию, потом по номеру человека.

## Каркас

```sql
SELECT person_id, ______(*) AS count_of_visits
FROM person_visits
GROUP BY ______
ORDER BY ______ DESC, ______ ASC;
```

## Почти ответ

```sql
SELECT person_id, COUNT(*) AS count_of_visits
FROM person_visits
GROUP BY person_id
ORDER BY count_of_visits ______, person_id ASC;
```

Осталось направление первой сортировки.
