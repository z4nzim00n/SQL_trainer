-- Идея: индекс строится по тому же выражению, что стоит в условии запроса.
CREATE INDEX idx_person_name ON person (UPPER(name));   -- индекс по именам в верхнем регистре

EXPLAIN ANALYZE
SELECT * FROM person WHERE UPPER(name) = 'ANNA';        -- то же выражение в условии
-- В плане: Index Scan using idx_person_name on person
