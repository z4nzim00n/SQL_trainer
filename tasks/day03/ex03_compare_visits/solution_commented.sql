-- Идея: (женщины EXCEPT ALL мужчины) UNION ALL (мужчины EXCEPT ALL женщины).
(SELECT pizzeria.name AS pizzeria_name                 -- посещения женщин
  FROM person_visits
  JOIN person ON person.id = person_visits.person_id
  JOIN pizzeria ON pizzeria.id = person_visits.pizzeria_id
  WHERE person.gender = 'female'
  EXCEPT ALL                                          -- вычитаем посещения мужчин по количеству
  SELECT pizzeria.name
  FROM person_visits
  JOIN person ON person.id = person_visits.person_id
  JOIN pizzeria ON pizzeria.id = person_visits.pizzeria_id
  WHERE person.gender = 'male')
UNION ALL                                             -- складываем с повторами
(SELECT pizzeria.name                                 -- то же, но наоборот
  FROM person_visits
  JOIN person ON person.id = person_visits.person_id
  JOIN pizzeria ON pizzeria.id = person_visits.pizzeria_id
  WHERE person.gender = 'male'
  EXCEPT ALL
  SELECT pizzeria.name
  FROM person_visits
  JOIN person ON person.id = person_visits.person_id
  JOIN pizzeria ON pizzeria.id = person_visits.pizzeria_id
  WHERE person.gender = 'female')
ORDER BY pizzeria_name;
