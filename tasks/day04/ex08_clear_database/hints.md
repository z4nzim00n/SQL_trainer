## Идея

Пять обычных представлений удаляются через `DROP VIEW`, материализованное через `DROP MATERIALIZED VIEW`.

## Каркас

```sql
DROP VIEW v_persons_female, v_persons_male, ______, ______, ______;
DROP ______ VIEW mv_dmitriy_visits_and_eats;
```

## Почти ответ

```sql
DROP VIEW v_persons_female, v_persons_male, v_generated_dates, v_symmetric_union, v_price_with_discount;
DROP ______ mv_dmitriy_visits_and_eats;
```

Осталась вторая команда: после `DROP` идут два слова.
