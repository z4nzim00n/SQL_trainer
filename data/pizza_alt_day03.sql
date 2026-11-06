-- Скрытые данные для заданий Day 03 (идентификаторы 1300-1399).
-- ex00: Kate посещает ещё две пиццерии (цены 850 и ровно 1000 попадают в диапазон)
insert into person_visits values (1300, 3, 3, '2022-01-09');
insert into person_visits values (1301, 3, 4, '2022-01-10');
-- ex03: перекос по полу в посещениях
insert into person_visits values (1302, 1000, 3, '2022-01-11');
insert into person_visits values (1303, 1005, 5, '2022-01-11');
-- ex04: Pizza Loft (107) заказывал только мужчина Egor; в DoDo заказывала Lena (женщина), раньше там были только женщины
insert into person_order values (1300, 1005, 119, '2022-01-12');
insert into person_order values (1301, 2, 10, '2022-01-02');
-- ex05: Andrey заходит в DoDo (и там заказывает) и в Papa Johns (заказа нет)
insert into person_visits values (1304, 2, 3, '2022-01-02');
insert into person_visits values (1305, 2, 4, '2022-01-12');
-- ex06: третья пиццерия с cheese pizza по 700
insert into menu values (1300, 1000, 'cheese pizza', 700);
