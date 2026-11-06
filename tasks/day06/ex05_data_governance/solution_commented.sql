-- Идея: описание таблицы и каждого столбца с точки зрения бизнеса.
COMMENT ON TABLE person_discounts IS 'Personal discounts of clients in specific pizzerias';
COMMENT ON COLUMN person_discounts.id IS 'Primary key of the discount record';
COMMENT ON COLUMN person_discounts.person_id IS 'Client who receives the discount (reference to person)';
COMMENT ON COLUMN person_discounts.pizzeria_id IS 'Pizzeria where the discount is valid (reference to pizzeria)';
COMMENT ON COLUMN person_discounts.discount IS 'Personal discount size in percent, from 0 to 100';
