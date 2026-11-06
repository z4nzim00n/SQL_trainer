-- Идея: те, кто попал ровно в одну из двух групп.
CREATE VIEW v_symmetric_union AS
(SELECT person_id FROM person_visits WHERE visit_date = '2022-01-02'   -- R
 EXCEPT
 SELECT person_id FROM person_visits WHERE visit_date = '2022-01-06')  -- минус S
UNION
(SELECT person_id FROM person_visits WHERE visit_date = '2022-01-06'   -- S
 EXCEPT
 SELECT person_id FROM person_visits WHERE visit_date = '2022-01-02')  -- минус R
ORDER BY person_id;
