-- Скрытый набор данных: те же таблицы, но данные чуть изменены.
-- Выполняется ПОСЛЕ pizza.sql. Нужен, чтобы нельзя было пройти задание,
-- подогнав запрос под конкретные строки из основной базы.

insert into person values (10, 'Zoya', 27, 'female', 'Samara');
insert into person values (11, 'Boris', 19, 'male', 'Kazan');

insert into pizzeria values (7, 'Pizza Loft', 4.0);

insert into menu values (19, 7, 'margherita pizza', 650);
insert into menu values (20, 3, 'margherita pizza', 700);
insert into menu values (21, 2, 'supreme pizza', 900);

insert into person_visits values (20, 10, 3, '2022-01-02');
insert into person_visits values (21, 11, 2, '2022-01-07');

insert into person_order values (21, 10, 10, '2022-01-02');
insert into person_order values (22, 11, 21, '2022-01-07');

-- Название с заглавной буквы: при общей сортировке оно встаёт между именами людей,
-- поэтому ошибка «один ORDER BY на весь UNION ALL» ловится при любых настройках сортировки.
insert into menu values (22, 7, 'Four cheese pizza', 800);
