-- Скрытые данные для заданий Day 02 (идентификаторы 1200-1299).
insert into person values (1200, 'Kira', 25, 'female', 'Kazan');
insert into person values (1201, 'Anton', 35, 'male', 'Moscow');

insert into menu values (1200, 3, 'pepperoni pizza deluxe', 900);
insert into menu values (1201, 1000, 'mushroom pizza', 700);

-- пропуски в датах: люди 1 и 2 тоже ходили в другие дни
insert into person_visits values (1200, 1, 3, '2022-01-04');
insert into person_visits values (1201, 2, 3, '2022-01-10');
insert into person_visits values (1202, 3, 2, '2022-01-05');
-- Dmitriy 8 января: Best Pizza (есть пицца дешевле 800) и Dominos (самая дешёвая ровно 800)
insert into person_visits values (1203, 9, 5, '2022-01-08');
insert into person_visits values (1204, 9, 2, '2022-01-08');

-- мужчины: Timur (Moscow) заказал и пепперони, и грибы; Egor (Samara) грибы; Oleg (Kazan) пепперони; Anton только сыр
insert into person_order values (1200, 1003, 6, '2022-01-02');
insert into person_order values (1201, 1003, 9, '2022-01-02');
insert into person_order values (1202, 1005, 13, '2022-01-03');
insert into person_order values (1203, 1001, 2, '2022-01-03');
insert into person_order values (1204, 1201, 1, '2022-01-03');
-- женщины: Vera сыр и пепперони; Denise только пепперони
insert into person_order values (1205, 1004, 1, '2022-01-04');
insert into person_order values (1206, 1004, 2, '2022-01-04');
insert into person_order values (1207, 1002, 2, '2022-01-04');
-- Denis заказывает новое меню (проверка Day 02 ex06)
insert into person_order values (1208, 4, 1201, '2022-01-05');
