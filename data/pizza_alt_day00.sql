-- Скрытые данные для заданий Day 00 (идентификаторы 1000-1099).
insert into person values (1000, 'Lena', 40, 'female', 'Kazan');
insert into person values (1001, 'Oleg', 17, 'male', 'Kazan');
insert into person values (1002, 'Denise', 29, 'female', 'Samara');
insert into person values (1003, 'Timur', 20, 'male', 'Moscow');
insert into person values (1004, 'Vera', 23, 'female', 'Moscow');
insert into person values (1005, 'Egor', 10, 'male', 'Samara');
insert into person values (1006, 'Ilya', 9, 'male', 'Samara');
insert into person values (1007, 'Sasha', 31, 'male', 'Moscow');

insert into pizzeria values (1000, 'Edge Low', 3.5);
insert into pizzeria values (1001, 'Edge High', 5);
insert into pizzeria values (1002, 'Below Edge', 3.4);

insert into person_visits values (1000, 1000, 3, '2022-01-06');
insert into person_visits values (1001, 1001, 2, '2022-02-10');
insert into person_visits values (1002, 1002, 3, '2022-01-05');
insert into person_visits values (1003, 1003, 4, '2022-01-10');
insert into person_visits values (1004, 1004, 1, '2022-01-09');
insert into person_visits values (1005, 1005, 1000, '2022-01-07');
insert into person_visits values (1006, 1000, 1001, '2022-01-07');
insert into person_visits values (1007, 1000, 1000, '2022-01-08');

insert into person_order values (1000, 1002, 13, '2022-01-07');
insert into person_order values (1001, 1000, 14, '2022-01-07');
insert into person_order values (1002, 1003, 15, '2022-01-07');
insert into person_order values (1003, 1004, 18, '2022-01-08');
insert into person_order values (1004, 1001, 18, '2022-01-07');
insert into person_visits values (1008, 1007, 3, '2022-01-06');
