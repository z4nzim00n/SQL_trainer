-- Учебные мини-таблицы для примеров в теории и справочнике.
-- Никак не связаны с пиццериями: маленькие таблицы, чтобы результат примера было видно целиком.

-- Для операторов множеств (UNION, INTERSECT, EXCEPT): есть повторы и пересечение
create table a (id integer, val varchar);
insert into a values (1, 'red');
insert into a values (2, 'green');
insert into a values (3, 'blue');
insert into a values (3, 'blue');

create table b (id integer, val varchar);
insert into b values (2, 'green');
insert into b values (3, 'blue');
insert into b values (4, 'yellow');

-- Для JOIN: у Eve нет курса (NULL), у курса Art нет студентов
create table courses (id integer primary key, title varchar not null);
insert into courses values (1, 'Math');
insert into courses values (2, 'Music');
insert into courses values (3, 'Art');

create table students (
    id integer primary key,
    name varchar not null,
    age integer not null,
    city varchar,
    course_id integer references courses (id)
);
insert into students values (1, 'Ann', 20, 'Berlin', 1);
insert into students values (2, 'Bob', 22, 'Paris', 1);
insert into students values (3, 'Cleo', 19, 'Berlin', 2);
insert into students values (4, 'Dan', 25, null, 2);
insert into students values (5, 'Eve', 21, 'Rome', null);

-- Для WHERE, типов, CASE, DML: есть NULL в note
create table products (
    id integer primary key,
    title varchar not null,
    category varchar not null,
    price numeric(8, 2) not null,
    added date not null,
    note varchar
);
insert into products values (1, 'Pen', 'office', 1.50, '2024-01-10', 'blue ink');
insert into products values (2, 'Notebook', 'office', 4.00, '2024-01-15', null);
insert into products values (3, 'Mug', 'home', 7.25, '2024-02-01', 'ceramic');
insert into products values (4, 'Lamp', 'home', 19.90, '2024-02-20', null);
insert into products values (5, 'Backpack', 'travel', 35.00, '2024-03-05', 'waterproof');

-- Для агрегатов и оконных функций
create table sales (
    id integer primary key,
    shop varchar not null,
    item varchar not null,
    qty integer not null,
    price numeric(8, 2) not null,
    sale_date date not null
);
insert into sales values (1, 'North', 'Pen', 10, 1.50, '2024-05-01');
insert into sales values (2, 'North', 'Mug', 2, 7.25, '2024-05-01');
insert into sales values (3, 'North', 'Pen', 5, 1.50, '2024-05-02');
insert into sales values (4, 'South', 'Lamp', 1, 19.90, '2024-05-01');
insert into sales values (5, 'South', 'Pen', 8, 1.50, '2024-05-02');
insert into sales values (6, 'South', 'Mug', 3, 7.25, '2024-05-03');
insert into sales values (7, 'East', 'Lamp', 2, 19.90, '2024-05-03');
