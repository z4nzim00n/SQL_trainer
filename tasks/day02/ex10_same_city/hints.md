## Идея

Возьми `person` дважды (`person1` и `person2`) и соедини по равенству адресов. Условие `person1.id > person2.id` оставит каждую пару один раз и уберёт совпадения человека с собой.

## Каркас

```sql
SELECT person1.name AS ______, person2.name AS ______, person1.address AS ______
FROM person AS person1
JOIN person AS person2 ON person1.address = person2.______ AND person1.id ____ person2.id
ORDER BY ______, ______, ______;
```

## Почти ответ

```sql
SELECT person1.name AS person_name1, person2.name AS person_name2, person1.address AS common_address
FROM person AS person1
JOIN person AS person2 ON person1.address = person2.address AND ______
ORDER BY person_name1, person_name2, common_address;
```

Осталось условие на `id`: у первого человека `id` больше.
