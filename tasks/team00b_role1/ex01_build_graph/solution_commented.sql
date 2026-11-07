-- Идея: таблица рёбер; каждое ребро вносим в обе стороны.
CREATE TABLE nodes (
    point1 varchar NOT NULL,
    point2 varchar NOT NULL,
    cost integer NOT NULL
);

INSERT INTO nodes (point1, point2, cost) VALUES   -- по две строки на ребро: туда и обратно
    ('a', 'b', 10),
    ('b', 'a', 10),
    ('a', 'c', 15),
    ('c', 'a', 15),
    ('a', 'd', 20),
    ('d', 'a', 20),
    ('b', 'c', 35),
    ('c', 'b', 35),
    ('b', 'd', 25),
    ('d', 'b', 25),
    ('c', 'd', 30),
    ('d', 'c', 30);
