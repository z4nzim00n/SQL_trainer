## Идея

Возьми запрос из задания 03 как подзапрос в `FROM` и дай ему имя. Затем присоедини `person` по `person_id` и возьми оттуда имя.

## Каркас

```sql
SELECT pv.action_date, person.name AS ______
FROM (
    SELECT order_date AS action_date, person_id FROM person_order
    INTERSECT
    SELECT visit_date, person_id FROM person_visits
) AS pv
JOIN person ON person.id = pv.______
ORDER BY action_date ______, person_name ______;
```

Впиши новое имя столбца, столбец связи и направления сортировки.

## Почти ответ

```sql
SELECT pv.action_date, person.name AS person_name
FROM ( ... INTERSECT ... ) AS pv
JOIN person ON person.id = pv.person_id
ORDER BY action_date ASC, ______ DESC;
```

Осталась вторая часть сортировки: по какому столбцу.
