-- Идея: в FROM временная таблица pv только с нужными посещениями,
-- а имена достаём подзапросами в SELECT (JOIN запрещён).
SELECT (SELECT name FROM person WHERE person.id = pv.person_id) AS person_name,         -- имя человека
       (SELECT name FROM pizzeria WHERE pizzeria.id = pv.pizzeria_id) AS pizzeria_name  -- название пиццерии
FROM (SELECT person_id, pizzeria_id          -- внутренний запрос в FROM
      FROM person_visits
      WHERE visit_date BETWEEN '2022-01-07' AND '2022-01-09') AS pv   -- псевдоним обязателен
ORDER BY person_name ASC, pizzeria_name DESC;  -- имя по возрастанию, пиццерия по убыванию
