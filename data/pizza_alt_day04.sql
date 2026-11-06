-- Скрытые данные для заданий Day 04 (идентификаторы 1400-1499).
-- ex04: R (2 января) и S (6 января): один только в R, один только в S, один в обеих
insert into person_visits values (1400, 1000, 3, '2022-01-02');
insert into person_visits values (1401, 1001, 3, '2022-01-06');
insert into person_visits values (1402, 1002, 3, '2022-01-02');
insert into person_visits values (1403, 1002, 3, '2022-01-06');
-- ex05: цена с хвостом после скидки (435 * 0.9 = 391.5)
insert into menu values (1400, 5, 'ham pizza', 435);
insert into person_order values (1400, 1, 1400, '2022-01-13');
