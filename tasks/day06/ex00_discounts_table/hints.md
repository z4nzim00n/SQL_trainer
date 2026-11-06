## Идея

Одна команда `CREATE TABLE` с четырьмя столбцами и двумя именованными ограничениями внешнего ключа. Типы идентификаторов возьми такие же, как у `id` в родительских таблицах (`bigint`).

## Каркас

```sql
CREATE TABLE person_discounts (
    id ______ PRIMARY KEY,
    person_id ______,
    pizzeria_id ______,
    discount ______,
    CONSTRAINT fk_person_discounts_person_id FOREIGN KEY (person_id) REFERENCES person (id),
    CONSTRAINT ______ FOREIGN KEY (pizzeria_id) REFERENCES pizzeria (id)
);
```

## Почти ответ

```sql
CREATE TABLE person_discounts (
    id bigint PRIMARY KEY,
    person_id bigint,
    pizzeria_id bigint,
    discount ______,
    CONSTRAINT fk_person_discounts_person_id FOREIGN KEY (person_id) REFERENCES person (id),
    CONSTRAINT fk_person_discounts_pizzeria_id FOREIGN KEY (pizzeria_id) REFERENCES pizzeria (id)
);
```

Осталось выбрать тип для дробной скидки.
