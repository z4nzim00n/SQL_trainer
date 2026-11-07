-- Мини-хранилище данных (DWH): пользователи, валюты с историей курсов и операции по балансу.
-- Таблица "user" называется как зарезервированное слово, поэтому в запросах её пишут в двойных кавычках.
create table "user" (id bigint primary key, name varchar, lastname varchar);
create table currency (id bigint not null, name varchar not null, rate_to_usd numeric(10, 4) not null, updated timestamp not null);
create table balance (user_id bigint not null, money numeric(12, 2) not null, type integer not null, currency_id bigint not null, updated timestamp not null);

insert into "user" values (101, 'Иван', 'Иванов');
insert into "user" values (102, 'Петр', null);
insert into "user" values (103, 'Сергей', 'Смирнов');
insert into "user" values (104, 'Мария', 'Сидорова');
insert into "user" values (105, 'Анна', 'Орлова');
insert into "user" values (106, null, 'Никитин');

insert into currency values (100, 'EUR', 0.9, '2022-03-03 13:31');
insert into currency values (100, 'EUR', 0.89, '2022-03-02 12:31');
insert into currency values (100, 'EUR', 0.87, '2022-03-02 08:00');
insert into currency values (100, 'EUR', 0.9, '2022-03-01 15:36');
insert into currency values (101, 'USD', 1, '2022-01-01 00:00');
insert into currency values (102, 'JPY', 0.0087, '2022-01-15 10:00');
insert into currency values (102, 'JPY', 0.0085, '2022-03-01 10:00');
insert into currency values (103, 'GBP', 1.31, '2022-03-10 12:00');
insert into currency values (103, 'GBP', 1.29, '2022-03-12 09:00');

-- Иван: два перевода в евро и один в долларах
insert into balance values (101, 100, 1, 100, '2022-01-09 04:23');
insert into balance values (101, 310, 1, 100, '2022-03-02 12:00');
insert into balance values (101, 40, 0, 101, '2022-01-05 10:00');
-- Петр: валюта 199 отсутствует в таблице currency
insert into balance values (102, 150, 2, 199, '2022-02-01 10:00');
insert into balance values (102, 53, 2, 199, '2022-02-15 11:00');
-- Сергей
insert into balance values (103, 200, 0, 100, '2022-03-03 12:31');
insert into balance values (103, 150, 0, 100, '2022-03-02 11:29');
insert into balance values (103, 15, 0, 100, '2022-03-03 08:00');
insert into balance values (103, -100, 1, 102, '2022-03-01 15:36');
insert into balance values (103, 2000, 1, 102, '2021-12-12 15:36');
-- Мария: курс фунта появился только после операции; одна операция точно в момент смены курса евро
insert into balance values (104, 80, 0, 103, '2022-03-01 09:00');
insert into balance values (104, 10, 1, 100, '2022-03-03 13:31');
-- пользователь без имени
insert into balance values (106, 70, 0, 101, '2022-02-01 08:00');
-- операции пользователя, которого нет в таблице user
insert into balance values (999, 500, 0, 100, '2022-03-05 09:00');
insert into balance values (999, 30, 1, 101, '2022-03-06 09:00');
