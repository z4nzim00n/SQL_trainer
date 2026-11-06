-- Идея: NATURAL JOIN сам ищет одинаково названные столбцы, поэтому переименовываем id в person_id.
SELECT order_date,
       CONCAT(name, ' (age:', age, ')') AS person_information
FROM person_order
NATURAL JOIN (SELECT id AS person_id,   -- теперь совпадает только person_id
                     name, age
              FROM person) AS p
ORDER BY order_date, person_information;
