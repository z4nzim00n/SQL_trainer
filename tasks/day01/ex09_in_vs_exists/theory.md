# Задание 09. NOT IN и NOT EXISTS

Нужны пиццерии без единого посещения. Посещения хранятся в `person_visits`, связь по `pizzeria_id`.

**`NOT IN`** проверяет, что значение **не входит** в список из подзапроса:

```sql
WHERE id NOT IN (SELECT pizzeria_id FROM person_visits)
```

**`NOT EXISTS`** проверяет, что связанных строк **нет вовсе**. Подзапрос привязан к внешней строке условием:

```sql
WHERE NOT EXISTS (SELECT 1 FROM person_visits WHERE person_visits.pizzeria_id = pizzeria.id)
```

Результаты одинаковые, но есть тонкость: если в списке `NOT IN` попадётся `NULL`, он вернёт пустой результат. `NOT EXISTS` с `NULL` не ломается, поэтому надёжнее.

Ключевые слова для примеров: `NOT IN`, `NOT EXISTS`, `EXISTS`.
