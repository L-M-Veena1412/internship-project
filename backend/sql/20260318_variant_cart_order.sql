-- One-time migration for variant-aware cart and orders.
-- Run this in MySQL Workbench against the same database used by backend.

START TRANSACTION;

SET @db = DATABASE();

-- 1) Cart items: store selected variant (product_qty row)
SET @exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'cart_items' AND COLUMN_NAME = 'product_qty_id'
);
SET @sql = IF(@exists = 0,
  'ALTER TABLE cart_items ADD COLUMN product_qty_id BIGINT UNSIGNED NULL AFTER product_id',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists = (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'cart_items' AND INDEX_NAME = 'idx_cart_items_product_qty_id'
);
SET @sql = IF(@exists = 0,
  'CREATE INDEX idx_cart_items_product_qty_id ON cart_items (product_qty_id)',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists = (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'cart_items' AND CONSTRAINT_NAME = 'fk_cart_items_product_qty'
);
SET @sql = IF(@exists = 0,
  'ALTER TABLE cart_items ADD CONSTRAINT fk_cart_items_product_qty FOREIGN KEY (product_qty_id) REFERENCES product_qty(id) ON UPDATE CASCADE ON DELETE SET NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Optional but recommended: prevent duplicate rows for same product+variant in a cart.
SET @exists = (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'cart_items' AND INDEX_NAME = 'uq_cart_items_cart_product_variant'
);
SET @sql = IF(@exists = 0,
  'CREATE UNIQUE INDEX uq_cart_items_cart_product_variant ON cart_items (cart_id, product_id, product_qty_id)',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2) Order items: snapshot selected variant for order history
SET @exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'order_items' AND COLUMN_NAME = 'product_qty_id'
);
SET @sql = IF(@exists = 0,
  'ALTER TABLE order_items ADD COLUMN product_qty_id BIGINT UNSIGNED NULL AFTER product_id',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'order_items' AND COLUMN_NAME = 'product_weight'
);
SET @sql = IF(@exists = 0,
  'ALTER TABLE order_items ADD COLUMN product_weight VARCHAR(30) NULL AFTER product_qty_id',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists = (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'order_items' AND INDEX_NAME = 'idx_order_items_product_qty_id'
);
SET @sql = IF(@exists = 0,
  'CREATE INDEX idx_order_items_product_qty_id ON order_items (product_qty_id)',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists = (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'order_items' AND CONSTRAINT_NAME = 'fk_order_items_product_qty'
);
SET @sql = IF(@exists = 0,
  'ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product_qty FOREIGN KEY (product_qty_id) REFERENCES product_qty(id) ON UPDATE CASCADE ON DELETE SET NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

COMMIT;

-- Verification
-- SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'cart_items';
-- SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'order_items';
