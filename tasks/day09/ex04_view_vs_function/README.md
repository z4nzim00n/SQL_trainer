# Задание 04. Представление против функции

**Язык:** SQL, DDL, DML

Раньше (Day 04) у тебя были два представления, делившие `person` по полу. Теперь определи две **SQL-функции** (именно `LANGUAGE sql`, не plpgsql):

- `fnc_persons_female`: возвращает женщин;
- `fnc_persons_male`: возвращает мужчин.

Проверять функции можно так (да, функцию можно использовать как виртуальную таблицу):

```sql
SELECT * FROM fnc_persons_male();
SELECT * FROM fnc_persons_female();
```
