# Теория: пересчёт по курсу на момент операции

Это ex01 и ex02, собранные вместе и дополненные пользователем и суммой.

**Как получить и название, и курс.** Подзапросы из предыдущих заданий возвращают одно значение. Здесь нужна целая строка валюты: найдите **время** подходящего курса и присоедините эту строку по `id` и `updated`:

```sql
JOIN currency c
  ON c.id = b.currency_id
 AND c.updated = COALESCE(
       (SELECT MAX(c2.updated) FROM currency c2
        WHERE c2.id = b.currency_id AND c2.updated <= b.updated),   -- t1
       (SELECT MIN(c3.updated) FROM currency c3
        WHERE c3.id = b.currency_id AND c3.updated >  b.updated))   -- t2
```

Обычный `JOIN` сам убирает операции с неизвестной валютой.

**Пользователя** присоединяйте через `LEFT JOIN` и подставляйте `COALESCE(name, 'not defined')`.

**Сумма:** `b.money * c.rate_to_usd`.

Типичные ошибки: взять ближайший курс в любую сторону (а нужно сначала прошлое), взять самый свежий курс вообще, потерять операции без пользователя.

Ключевые слова для примеров: `JOIN`, `LEFT JOIN`, `COALESCE`, `MAX`, `MIN`, `SUBQUERY`.
