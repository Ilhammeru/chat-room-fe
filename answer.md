# Answer

## Level 1: Write SQL query to show how many customers from Germany
```sql
SELECT count(CustomerId) as totalCustomer FROM Customers
WHERE Country = 'Germany';
```

## Level 2: Write query to show list of the countries that have the most customers
```sql
SELECT COUNT(CustomerId) as Total, Country FROM Customers
GROUP BY Country
HAVING COUNT(CustomerId) >= 5
ORDER BY Total desc, Country desc;
```

## Level 3: Reverse engineer
```sql
SELECT 
    C.CustomerName, 
    COUNT(O.OrderID) as OrderCount,
    MIN(O.OrderDate) as FirstOrderDate,
    MAX(O.OrderDate) as LastOrderDate
FROM Orders O
LEFT JOIN Customers C ON C.CustomerID = O.CustomerID
GROUP BY C.CustomerID, C.CustomerName
HAVING COUNT(O.OrderID) >= 5
ORDER BY LastOrderDate DESC, OrderCount desc;
```