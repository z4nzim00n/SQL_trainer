-- Идея: соединяем заказ с человеком и склеиваем его имя и возраст.
SELECT person_order.order_date,
       CONCAT(person.name, ' (age:', person.age, ')') AS person_information   -- Andrey (age:21)
FROM person_order
JOIN person ON person_order.person_id = person.id    -- заказ связан с человеком по person_id
ORDER BY order_date, person_information;             -- по обоим столбцам по возрастанию
