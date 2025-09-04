<img width="1919" height="1072" alt="Screenshot 2025-09-05 031633" src="https://github.com/user-attachments/assets/3eefb47c-7ece-4209-ab0c-a1e35b460cf6" />
<img width="1919" height="1070" alt="Screenshot 2025-09-05 031652" src="https://github.com/user-attachments/assets/ecdd8429-6031-4769-871d-9425ef3f384d" />
<img width="971" height="1071" alt="Screenshot 2025-09-05 031802" src="https://github.com/user-attachments/assets/afdaa3a1-7041-44a7-be97-d48dadb93ec8" />
<img width="1032" height="1056" alt="Screenshot 2025-09-05 031823" src="https://github.com/user-attachments/assets/9d7a3272-3fb0-4670-b663-9b02f08da5f5" />




# Nearest Seller

A PHP & MySQL-based web application to find the nearest sellers for users.
---

## Features

### User Side
- Find nearest sellers based on location.
- View seller details (name, address, contact, products).
- Simple and responsive UI.

---

## Tech Stack
- **Backend:** PHP (MySQLi)
- **Database:** MySQL
- **Frontend:** HTML, CSS, basic JS
- **Server:** Localhost

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayushsingh1028/nearest_seller.git
   cd nearest_seller


*Configure DB connection:

Open db_connection.php.

Update database credentials:

$host = "localhost";
$user = "root";
$pass = "your_password";
$db   = "nearest_seller";

## Folder Structure
nearest_seller/
│
├── admin/                  # Admin portal pages (login.php, dashboard.php)
├── css/                    # Stylesheets
├── js/                     # JavaScript files
├── db_connection.php       # Database connection
├── index.php               # Main user page
├── sellers.php             # User seller listing
├── logout.php              # Admin logout
└── README.md


## Database Setup (SQL)
sql-
CREATE DATABASE nearest_seller;

USE nearest_seller;

-- Customers
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

-- Sellers
CREATE TABLE sellers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

-- Products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50)
);

-- Inventory (which seller sells which product)
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT,
    product_id INT,
    FOREIGN KEY (seller_id) REFERENCES sellers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    customer_id INT,
    product_id INT,
    seller_id INT,
    distance DECIMAL(6,2),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (seller_id) REFERENCES sellers(id)
);




Author

Ayush Singh
Computer Science Student | Manipal University Jaipur
