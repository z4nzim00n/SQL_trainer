-- Скрытый набор данных: те же таблицы, но данные чуть изменены.
-- Выполняется ПОСЛЕ pizza.sql. Нужен, чтобы нельзя было пройти задание,
-- подогнав запрос под конкретные строки из основной базы.

insert into person values (110, 'Zoya', 27, 'female', 'Samara');
insert into person values (111, 'Boris', 19, 'male', 'Kazan');

insert into pizzeria values (107, 'Pizza Loft', 4.0);

insert into menu values (119, 107, 'margherita pizza', 650);
insert into menu values (120, 3, 'margherita pizza', 700);
insert into menu values (121, 2, 'supreme pizza', 900);

insert into person_visits values (120, 110, 3, '2022-01-02');
insert into person_visits values (121, 111, 2, '2022-01-07');

insert into person_order values (121, 110, 10, '2022-01-02');
insert into person_order values (122, 111, 121, '2022-01-07');

-- Название с заглавной буквы: при общей сортировке оно встаёт между именами людей,
-- поэтому ошибка «один ORDER BY на весь UNION ALL» ловится при любых настройках сортировки.
insert into menu values (122, 107, 'Four cheese pizza', 800);
