-- Идея: таблица person соединяется сама с собой по одинаковому адресу.
SELECT person1.name AS person_name1,
       person2.name AS person_name2,
       person1.address AS common_address
FROM person AS person1
JOIN person AS person2
  ON person1.address = person2.address   -- одинаковый адрес
 AND person1.id > person2.id             -- каждая пара один раз, без «человек с самим собой»
ORDER BY person_name1, person_name2, common_address;
