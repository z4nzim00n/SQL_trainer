# Задание 05. Частичная уникальность

**Разрешено:** ANSI SQL

Создай **частично уникальный** B-Tree индекс с именем `idx_person_order_order_date` на таблице `person_order` по атрибутам `person_id` и `menu_id`. Уникальность должна действовать только для строк с датой заказа `'2022-01-01'`.

План `EXPLAIN ANALYZE` должен соответствовать шаблону:

```
Index Only Scan using idx_person_order_order_date on person_order ...
```

> Тренажёр проверяет сам индекс (уникальный, частичный, условие, столбцы) и план запроса `SELECT person_id, menu_id FROM person_order WHERE order_date = '2022-01-01'`.
