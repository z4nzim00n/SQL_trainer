## Идея

Напиши `R` и `S` как два `SELECT person_id FROM person_visits WHERE visit_date = ...`. Потом `(R EXCEPT S) UNION (S EXCEPT R)` и `ORDER BY person_id`, всё внутри `CREATE VIEW`.

## Каркас

```sql
CREATE VIEW v_symmetric_union AS
(SELECT person_id FROM person_visits WHERE visit_date = '2022-01-02'
 EXCEPT
 SELECT person_id FROM person_visits WHERE visit_date = '______')
UNION
(______)
ORDER BY ______;
```

## Почти ответ

```sql
CREATE VIEW v_symmetric_union AS
(R EXCEPT S)
UNION
(SELECT person_id FROM person_visits WHERE visit_date = '2022-01-06'
 EXCEPT
 SELECT person_id FROM person_visits WHERE visit_date = '______')
ORDER BY person_id;
```

Осталась дата второй группы в обратной разности.
