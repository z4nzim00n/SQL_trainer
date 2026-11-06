## Идея

Выбери из `person` двух нужных людей (`Denis`, `Irina`). Для каждого строка посещения: свой `id` (максимум плюс что-то уникальное), номер человека, id пиццерии Dominos подзапросом и дата.

## Каркас

```sql
INSERT INTO person_visits (id, person_id, pizzeria_id, visit_date)
SELECT (SELECT MAX(id) FROM person_visits) + person.id,
       person.______,
       (SELECT id FROM pizzeria WHERE name = '______'),
       '______'
FROM person
WHERE person.name = 'Denis' OR person.name = '______';
```

## Почти ответ

```sql
INSERT INTO person_visits (id, person_id, pizzeria_id, visit_date)
SELECT (SELECT MAX(id) FROM person_visits) + person.id, person.id,
       (SELECT id FROM pizzeria WHERE name = 'Dominos'), '______'
FROM person
WHERE person.name = 'Denis' OR person.name = 'Irina';
```

Осталась дата в формате `ГГГГ-ММ-ДД`.
