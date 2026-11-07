-- Скрытый набор: новые курсы, новые пользователи и операции с теми же аномалиями.
insert into currency values (100, 'EUR', 0.95, '2022-03-04 10:00');
insert into currency values (102, 'JPY', 0.0079, '2022-03-20 10:00');
insert into currency values (104, 'CHF', 1.08, '2022-02-10 10:00');
insert into currency values (104, 'CHF', 1.11, '2022-03-08 10:00');
insert into "user" values (107, 'Олег', null);
insert into "user" values (108, null, null);
insert into balance values (105, 300, 0, 104, '2022-02-20 12:00');
insert into balance values (105, -50, 0, 104, '2022-03-08 10:00');
insert into balance values (105, 25, 3, 100, '2022-03-01 00:00');
insert into balance values (107, 60, 1, 103, '2022-03-11 10:00');
insert into balance values (107, 90, 1, 103, '2022-03-20 10:00');
insert into balance values (108, 12, 0, 104, '2022-02-01 10:00');
insert into balance values (108, 8, 0, 105, '2022-03-01 10:00');
insert into balance values (888, 44, 4, 104, '2022-03-09 10:00');
insert into balance values (101, 19, 1, 102, '2022-03-25 10:00');
