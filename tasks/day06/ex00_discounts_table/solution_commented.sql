-- Идея: таблица связи «клиент ↔ пиццерия» со скидкой.
CREATE TABLE person_discounts (
    id bigint PRIMARY KEY,                -- как id в остальных таблицах
    person_id bigint,                     -- тип совпадает с person.id
    pizzeria_id bigint,                   -- тип совпадает с pizzeria.id
    discount numeric,                     -- может быть дробной (10.5)
    CONSTRAINT fk_person_discounts_person_id FOREIGN KEY (person_id) REFERENCES person (id),
    CONSTRAINT fk_person_discounts_pizzeria_id FOREIGN KEY (pizzeria_id) REFERENCES pizzeria (id)
);
