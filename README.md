# EasyImportDesktop

That's my first and only project using Angular

```diff

- The site is for desktop use only.

App implemented for a company in Brazil that works with imported products from China. 

It is highly customised for the company.

It mainly allows the company to keep track of payments to exporter, create products that are imported and create orders.

The main benefits are:

! Financial department: Is able to check what has been paid and any due payment, so they can plan the cashflow accordingly.

! Executives: They can check the orders in progress as well as old orders in history. They can check when the products will arrive and liaise with their team and customers

! Directors and purchase department: Can create orders by adding products to a cart, then it is possible to check the volume of the order
! (if the order has a full container or not) as well as the total for products and total for taxes. 
! Bear in mind that each product as 4 taxes percentage to be calculated.


Backend -->  ASP.NET Core 3:

•	API end points
•	Using IDENTITY for user auth
•	There are 2 roles active “Admin” and “SimpleUser” attached to the JWT token.
•	After the login, a JWT token is sent to the user with the role and then stored in local storage.
•	Generic repository (using the specification pattern)
•	Redis
•	Dependency injection
•	MySQL and/or SQL Server with over 10 different tables
•	Entity framework
•	Using code first migration schema for the database
•	AutoMapper
•	Cloudinary service for storing pictures online.

Front End --> Angular 9:

•	Typescript


Site in action --> https://easyimport.azurewebsites.net/#/home

For username and password please, contact me.

Just a brief explanation 
 

```

![image](https://user-images.githubusercontent.com/42220810/126909424-036fec19-3e8b-4cc0-aa3d-22b609d43dff.png)

Sidebar --> The "User" is only visible for Admin

![image](https://user-images.githubusercontent.com/42220810/126909474-e76a74e2-d21a-4778-bc3e-72994db6769e.png)

User have different access level, determined by the admin

![image](https://user-images.githubusercontent.com/42220810/126909513-532c4237-e437-41ca-b3c0-0e0403417ac5.png)

Top right corner, user can change picture and password

![image](https://user-images.githubusercontent.com/42220810/126909526-8eef66e5-4e37-4855-a4c7-e69a505ca77a.png)

For those 3 sections, it is possibe to add information

![image](https://user-images.githubusercontent.com/42220810/126909582-29e0b1af-a4f5-43c3-a0ce-d26abb15cc22.png)

In that case, NCM is the same as HS Code (international classification code for each product). In case of Brazil there are 4 taxes for each product. It is possible to search for an item, CRUD the item, pagination. Same for "Category" and "Supplier"

![image](https://user-images.githubusercontent.com/42220810/126910084-b193fa98-9197-4246-86f7-679ed9f8c6a1.png)
There are real time checking to avoid duplicate names for suppliers, categories, etc...

![image](https://user-images.githubusercontent.com/42220810/126909662-62106501-e8c0-43c8-b90c-53414d5a9d0b.png)

For products,it is possible to create it and add extra info such as supplier, NCM (so it can calculate taxes) and category. 

It is also possible to check in a chart the last purchases (max of 8)

There is a tab for carton details such as sizes and weight, so it can calculate the volume for the container when creating order

![image](https://user-images.githubusercontent.com/42220810/126909731-4fc374df-7cfb-4b40-864b-5e1ebbe5ebd8.png)

For pictures, it is possible to drag and drop a picture and it will be stored in the cloud using cloudinary.

![image](https://user-images.githubusercontent.com/42220810/126909768-06d72699-8fb5-433d-99ba-02e039714a7f.png)

In order to create an order, on the "product" tab selected on sidebar. You can choose your product and add the quantity. 

![image](https://user-images.githubusercontent.com/42220810/126909796-b8957261-065b-4521-8a09-25b363e77577.png)

It will be add to the cart

![image](https://user-images.githubusercontent.com/42220810/126909825-ec9e0ae3-89b8-418a-a8e6-213860d30413.png)

On the cart page, you can see the "order brief" with information for volume, in that case 3.13 M3, taxes, weight, etc..

You can hit "submit order" to create the order

![image](https://user-images.githubusercontent.com/42220810/126909879-4f1e39ab-99b2-4c9a-a630-675ecd9f08b4.png)

On the "order" tab, you can see the order in progress, it has 3 status as you can see the colours badges here. With a brief of the totals and also CBM and date for the container to arrive at the company.


![image](https://user-images.githubusercontent.com/42220810/126909970-2737561f-4d6e-4eb0-9214-4b591b04a693.png)

Here on "Payments", It is possible to have an overview for the payments, so the financial can keep track of payments. Usually there are 2 payments for each import. Once both payment has been done, it is moved to another page. That can be accessed on the dropdown list above
