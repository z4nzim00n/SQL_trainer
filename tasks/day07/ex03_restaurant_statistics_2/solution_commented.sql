-- Идея: сложить заказы и посещения каждой пиццерии.
SELECT name, SUM(count) AS total_count
FROM (SELECT pizzeria.name, COUNT(*) AS count            -- заказы по пиццериям
      FROM person_order
      JOIN menu ON menu.id = person_order.menu_id
      JOIN pizzeria ON pizzeria.id = menu.pizzeria_id
      GROUP BY pizzeria.name
      UNION ALL                                           -- ALL: одинаковые пары не схлопываются
      SELECT pizzeria.name, COUNT(*) AS count            -- посещения по пиццериям
      FROM person_visits
      JOIN pizzeria ON pizzeria.id = person_visits.pizzeria_id
      GROUP BY pizzeria.name) AS stats
GROUP BY name
ORDER BY total_count DESC, name ASC;
