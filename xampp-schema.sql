-- Import this file in phpMyAdmin for the XAMPP connection.
CREATE DATABASE IF NOT EXISTS halfcourt_shoe
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE halfcourt_shoe;

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  contact_number VARCHAR(20) NULL,
  address VARCHAR(255) NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(40) PRIMARY KEY,
  model VARCHAR(10) NOT NULL,
  name VARCHAR(120) NOT NULL,
  colorway VARCHAR(80) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  badge VARCHAR(30) NULL,
  image_url VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_sizes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(40) NOT NULL,
  size VARCHAR(6) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_product_size (product_id, size),
  CONSTRAINT fk_product_sizes_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS shipping_methods (
  id VARCHAR(20) PRIMARY KEY,
  label VARCHAR(80) NOT NULL,
  eta VARCHAR(40) NOT NULL,
  fee DECIMAL(10,2) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(20) NOT NULL UNIQUE,
  customer_id INT NULL,
  status VARCHAR(12) NOT NULL DEFAULT 'Processing',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_method_id VARCHAR(20) NULL,
  shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  placed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP NULL,
  INDEX idx_orders_customer (customer_id),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT fk_orders_shipping FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_addresses (
  order_id INT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(160) NULL,
  street VARCHAR(160) NOT NULL,
  barangay VARCHAR(80) NOT NULL,
  city VARCHAR(80) NOT NULL,
  province VARCHAR(80) NOT NULL,
  zip VARCHAR(10) NOT NULL,
  CONSTRAINT fk_order_addresses_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id VARCHAR(40) NOT NULL,
  size VARCHAR(6) NOT NULL,
  qty INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  name VARCHAR(120) NOT NULL,
  colorway VARCHAR(80) NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

INSERT INTO shipping_methods (id, label, eta, fee) VALUES
  ('metro', 'Metro Davao delivery', '1-2 days', 120),
  ('nation', 'Nationwide delivery', '3-7 days', 180),
  ('pickup', 'Pickup at Lanang store', 'Ready in 24 hrs', 0)
ON DUPLICATE KEY UPDATE label = VALUES(label), eta = VALUES(eta), fee = VALUES(fee);

INSERT INTO products (id, model, name, colorway, price, stock, badge) VALUES
  ('aj1-high-red', '1', 'Air Jordan 1 High', 'Chicago', 5995, 8, 'Icon'),
  ('aj1-low-panda', '1', 'Air Jordan 1 Low', 'Panda', 4995, 12, NULL),
  ('aj3-black-cement', '3', 'Air Jordan 3', 'Black Cement', 7000, 5, 'OG'),
  ('aj4-bred', '4', 'Air Jordan 4', 'Bred', 7000, 6, 'Hot'),
  ('aj4-white-oreo', '4', 'Air Jordan 4', 'White Oreo', 7000, 9, NULL),
  ('aj5-fire-red', '5', 'Air Jordan 5', 'Fire Red', 5995, 4, 'Limited'),
  ('aj6-infrared', '6', 'Air Jordan 6', 'Infrared', 5995, 7, NULL),
  ('aj9-chile-red', '9', 'Air Jordan 9', 'Chile Red', 4995, 3, 'Low Stock'),
  ('aj11-concord', '11', 'Air Jordan 11', 'Concord', 6495, 10, 'Classic'),
  ('aj12-flugame', '12', 'Air Jordan 12', 'Flu Game', 6495, 5, 'Story')
ON DUPLICATE KEY UPDATE
  model = VALUES(model), name = VALUES(name), colorway = VALUES(colorway),
  price = VALUES(price), stock = VALUES(stock), badge = VALUES(badge), is_active = 1;

INSERT INTO product_sizes (product_id, size, stock) VALUES
  ('aj1-high-red', '7', 1), ('aj1-high-red', '7.5', 1), ('aj1-high-red', '8', 1),
  ('aj1-high-red', '8.5', 1), ('aj1-high-red', '9', 1), ('aj1-high-red', '9.5', 1),
  ('aj1-high-red', '10', 1), ('aj1-high-red', '11', 1), ('aj1-high-red', '12', 1),
  ('aj1-low-panda', '6', 2), ('aj1-low-panda', '6.5', 2), ('aj1-low-panda', '7', 2),
  ('aj1-low-panda', '7.5', 2), ('aj1-low-panda', '8', 2), ('aj1-low-panda', '8.5', 2),
  ('aj3-black-cement', '8', 1), ('aj3-black-cement', '8.5', 1), ('aj3-black-cement', '9', 1),
  ('aj3-black-cement', '9.5', 1), ('aj3-black-cement', '10', 1),
  ('aj4-bred', '7', 1), ('aj4-bred', '7.5', 1), ('aj4-bred', '8', 1),
  ('aj4-bred', '8.5', 1), ('aj4-bred', '9', 1), ('aj4-bred', '9.5', 1),
  ('aj4-white-oreo', '7', 2), ('aj4-white-oreo', '7.5', 2), ('aj4-white-oreo', '8', 2),
  ('aj4-white-oreo', '8.5', 1), ('aj4-white-oreo', '9.5', 1), ('aj4-white-oreo', '10', 1),
  ('aj5-fire-red', '8', 1), ('aj5-fire-red', '8.5', 1), ('aj5-fire-red', '9', 1), ('aj5-fire-red', '9.5', 1),
  ('aj6-infrared', '7', 1), ('aj6-infrared', '7.5', 1), ('aj6-infrared', '8', 1),
  ('aj6-infrared', '8.5', 1), ('aj6-infrared', '9', 1), ('aj6-infrared', '9.5', 1), ('aj6-infrared', '10', 1),
  ('aj9-chile-red', '8', 1), ('aj9-chile-red', '8.5', 1), ('aj9-chile-red', '9', 1),
  ('aj11-concord', '7', 2), ('aj11-concord', '7.5', 2), ('aj11-concord', '8', 2),
  ('aj11-concord', '8.5', 1), ('aj11-concord', '9', 1), ('aj11-concord', '9.5', 1),
  ('aj12-flugame', '7.5', 1), ('aj12-flugame', '8', 1), ('aj12-flugame', '8.5', 1),
  ('aj12-flugame', '9', 1), ('aj12-flugame', '9.5', 1)
ON DUPLICATE KEY UPDATE stock = VALUES(stock);

-- Table-like view for browsing customer and order information in phpMyAdmin.
CREATE OR REPLACE VIEW customer_order_details AS
SELECT
  o.id AS order_id,
  o.order_no,
  o.status,
  o.subtotal,
  o.shipping_fee,
  o.total,
  o.placed_at,
  o.customer_id,
  a.full_name,
  a.phone,
  a.email,
  a.street,
  a.barangay,
  a.city,
  a.province,
  a.zip,
  i.product_id,
  i.name AS product_name,
  i.colorway,
  i.size,
  i.qty,
  i.unit_price
FROM orders o
JOIN order_addresses a ON a.order_id = o.id
JOIN order_items i ON i.order_id = o.id;
