-- ==============================================================================
-- KOMOREBI ATELIER - LUXURY JAPANDI INTERIOR DATABASE SCHEMA (MYSQL / MARIADB)
-- HỆ THỐNG CƠ SỞ DỮ LIỆU DÀNH CHO MYSQL 8.0+ / MARIADB / PHPMYADMIN / LARAGON / XAMPP
-- Bộ mã ký tự: utf8mb4_unicode_ci
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS komorebi_interior CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE komorebi_interior;

-- 1. BẢNG DANH MỤC KHÔNG GIAN (CATEGORIES)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG SẢN PHẨM MỘC BẢN (PRODUCTS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    sku VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category_id VARCHAR(50) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    original_price DECIMAL(15, 2),
    material VARCHAR(255) NOT NULL,
    dimensions VARCHAR(255),
    description TEXT,
    tag VARCHAR(100),
    image VARCHAR(500) NOT NULL,
    stock_quantity INT DEFAULT 10,
    is_featured TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG ALBUM HÌNH ẢNH SẢN PHẨM (PRODUCT_IMAGES)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    is_primary TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG NGƯỜI DÙNG & HỘI VIÊN (USERS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    studio_name VARCHAR(255),
    company VARCHAR(255),
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'client', -- 'client', 'architect', 'admin'
    is_fsc_certified TINYINT(1) DEFAULT 1,
    dob DATE,
    gender VARCHAR(20) DEFAULT 'Nam',
    tax_id VARCHAR(50),
    preferred_wood VARCHAR(255) DEFAULT 'Gỗ Sồi Trắng Bắc Mỹ (White Oak)',
    care_frequency VARCHAR(255) DEFAULT 'Mỗi 6 tháng (Komorebi Khuyến nghị)',
    addresses JSON,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BẢNG ĐƠN ĐẶT HÀNG (ORDERS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    order_code VARCHAR(100) NOT NULL UNIQUE,
    user_id VARCHAR(50),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    shipping_address TEXT NOT NULL,
    province VARCHAR(100),
    district VARCHAR(100),
    ward VARCHAR(100),
    order_note TEXT,
    subtotal DECIMAL(15, 2) NOT NULL,
    shipping_fee DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    order_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. BẢNG CHI TIẾT SẢN PHẨM TRONG ĐƠN HÀNG (ORDER_ITEMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50),
    product_title VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    product_image VARCHAR(500),
    selected_wood VARCHAR(255),
    selected_upholstery VARCHAR(255),
    selected_size VARCHAR(255),
    unit_price DECIMAL(15, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. BẢNG YÊU CẦU TƯ VẤN KIẾN TRÚC & MẶT BẰNG (CONSULTATIONS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    full_name VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    space_type VARCHAR(255) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. BẢNG DANH SÁCH YÊU THÍCH (WISHLISTS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlists (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wishlists_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlists_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. BẢNG HỆ THỐNG SHOWROOM & ATELIER (SHOWROOMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS showrooms (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    opening_hours VARCHAR(255) NOT NULL,
    map_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DỮ LIỆU KHỞI TẠO MẪU (SEED DATA - MYSQL SYNTAX)
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT IGNORE INTO categories (id, name, slug, description, sort_order) VALUES
('cat-living', 'Không Gian Phòng Khách', 'phong-khach', 'Tuyển tập các tác phẩm nội thất mộc bản cho gian khách đương đại phong cách Japandi Wabi-sabi.', 1),
('cat-dining', 'Không Gian Phòng Bếp & Ăn', 'phong-bep', 'Bàn ăn mở rộng, ghế ăn công thái học chế tác từ gỗ sồi và tần bì nguyên khối.', 2),
('cat-bedroom', 'Không Gian Phòng Ngủ', 'phong-ngu', 'Giường phản mộng Kigumi, chiếu Tatami Kyoto thanh lọc không gian tĩnh tại.', 3),
('cat-collection', 'Bộ Sưu Tập Signature', 'bo-suu-tap', 'Các thiết kế độc bản kết hợp giữa kỹ nghệ mộc truyền thống và công năng đương đại.', 4),
('cat-architecture', 'Dự Án Kiến Trúc', 'du-an-kien-truc', 'Công trình nhà phố, biệt thự và penthouse ứng dụng triết lý khoảng trống Ma (間).', 5);

-- 2. SEED PRODUCTS
INSERT IGNORE INTO products (id, sku, title, slug, category_id, price, original_price, material, dimensions, description, tag, image, stock_quantity, is_featured) VALUES
-- Phòng khách
('living-1', 'KL-SOF-NAM', 'Sofa Ba Chỗ Gỗ Sồi Nami', 'sofa-go-soi-nami', 'cat-living', 28500000, 32000000, 'Gỗ Sồi Trắng Bắc Mỹ • Vải Lanh Mộc', 'D2200 x R880 x C720 mm', 'Đệm mút đàn hồi cao bọc sợi tự nhiên 100%, khung gỗ sồi gia công liên kết mộng âm dương không đinh ốc.', 'BÁN CHẠY NHẤT', '/images/living-1.jpg', 8, 1),
('living-2', 'KL-TAB-ENS', 'Bàn Trà Tròn Enso', 'ban-tra-tron-enso', 'cat-living', 12200000, 14000000, 'Gỗ Tần Bì Hun Khói • Dáng Tròn Wabi', 'D900 x C350 mm', 'Mặt bàn tròn bo viền vát cạnh mềm mại, chân đế ba điểm vững chãi mang đậm dấu ấn thiền định tối giản.', 'GỖ NGUYÊN KHỐI', '/images/living-2.jpg', 12, 1),
('living-3', 'KL-LOU-01', 'Ghế Bành Thư Giãn Kura', 'kura-lounge-chair', 'cat-living', 14800000, 16500000, 'Gỗ Óc Chó Walnut • Da Bò Thuộc Thảo Mộc', 'D840 x R760 x C780 mm', 'Độ nghiêng 105 độ công thái học nâng đỡ đốt sống lưng, khung gỗ óc chó đánh sáp thực vật tự nhiên.', 'THIẾT KẾ ĐỘC BẢN', '/images/living-3.jpg', 6, 1),
('living-4', 'KL-CAB-KAW', 'Kệ Tivi Treo Tường Kawa', 'ke-tivi-kawa', 'cat-living', 19400000, 22000000, 'Gỗ Sồi Tự Nhiên • Ngăn Kéo Khớp Mộng', 'D2000 x R400 x C320 mm', 'Hệ ray âm giảm chấn Hafele, mặt cánh lật kết hợp lam gỗ tạo khe thông gió giải nhiệt cho thiết bị âm thanh.', 'TREO TƯỜNG', '/images/living-4.jpg', 5, 0),
('living-5', 'KL-POU-TAT', 'Đệm Ngồi Thiền Tatami Pouf', 'tatami-reading-pouf', 'cat-living', 3600000, 4200000, 'Vải Thô Dệt Tay • Ruột Bông Gòn Hữu Cơ', 'D600 x R600 x C250 mm', 'Tạo góc tĩnh tọa bên cửa sổ hoặc bàn trà thấp, bề mặt dệt thô mộc xơ lanh kháng khuẩn tự nhiên.', 'THỦ CÔNG', '/images/living-5.jpg', 20, 0),
('living-6', 'KL-SHE-SOR', 'Tủ Kệ Sách Kiến Trúc Sora', 'tu-ke-sach-sora', 'cat-living', 34000000, 38000000, 'Gỗ Sồi Trắng Bắc Mỹ • Khung Rỗng Thoáng', 'D1600 x R380 x C2100 mm', 'Phân chia không gian ước lệ bằng nhịp điệu hình học không có hậu tủ, cho phép ánh sáng xuyên qua tự nhiên.', 'KẾT CẤU KIGUMI', '/images/living-6.jpg', 4, 0),
('living-7', 'KL-SOF-GOC', 'Sofa Góc Chữ L Nỉ Cao Cấp', 'sofa-goc-ni-chu-l-cao-cap', 'cat-living', 35800000, 39500000, 'Gỗ Sồi Tự Nhiên • Vải Nỉ Cao Cấp', 'D2800 x R1600 x C820 mm', 'Cấu trúc chữ L ôm trọn không gian phòng khách, đệm mút đàn hồi cao chống xẹp lún kết hợp vải nỉ dệt cao cấp êm ái.', 'MẪU MỚI', '/images/bo-sofa-ni-goc-hinh-chu-l-cho-phong-khach-cao-cap.jpg', 7, 1),

-- Phòng ăn & bếp
('dining-1', 'KL-TAB-18', 'Bàn Ăn Mở Rộng Mori Oak (1.8m - 2.4m)', 'mori-oak-table', 'cat-dining', 24500000, 26800000, 'Gỗ Sồi Trắng Bắc Mỹ • Mộng Âm Dương', 'D1800-2400 x R900 x C750 mm', 'Cơ cấu ray trượt gỗ sồi chịu tải không phụ thuộc kim loại cơ học, chống kẹt ray và hạn chế rung lắc tuyệt đối.', 'GỖ SỒI BẮC MỸ', '/images/dining-2.jpg', 9, 1),
('dining-2', 'KL-CHA-KAN', 'Bộ 4 Ghế Ăn Tối Giản Kanso', 'ghe-an-kanso', 'cat-dining', 16800000, 18500000, 'Gỗ Sồi FAS • Đệm Da Bò Sáp Ý', 'D480 x R520 x C800 mm', 'Đường cong tựa lưng tạo điểm tì êm ái cho bữa ăn gia đình kéo dài, bọc da sáp chống bám dầu mỡ tự nhiên.', 'BÁN CHẠY NHẤT', '/images/dining-3.jpg', 15, 1),
('dining-3', 'KL-TAB-ENS-D', 'Bàn Ăn Tròn Tĩnh Tọa Enso (ĐK 1.4m)', 'ban-an-tron-enso', 'cat-dining', 29000000, 32000000, 'Gỗ Óc Chó Walnut Bắc Mỹ Nguyên Tấm', 'D1400 x C750 mm', 'Dáng tròn tụ khí đoàn viên, giác gỗ chuyển tiếp màu nâu socola trầm ấm đánh bóng bằng dầu lau thực vật tự nhiên.', 'NGUYÊN KHỐI', '/images/dining-4.jpg', 5, 0),
('dining-4', 'KL-BEN-SOL', 'Ghế Băng Dài Gỗ Sồi Mộc Bản', 'ghe-bang-go-soi', 'cat-dining', 8900000, 9800000, 'Gỗ Sồi Tự Nhiên • Dài 1.6m', 'D1600 x R380 x C450 mm', 'Giải pháp ngồi linh hoạt cho bàn ăn gia đình đông thành viên, vát cạnh mộc mạc chống va quẹt cho trẻ nhỏ.', 'TIỆN ÍCH', '/images/dining-5.jpg', 11, 0),
('dining-5', 'KL-CAB-MIZ', 'Tủ Chén Bát Mizu Sideboard', 'tu-chen-mizu', 'cat-dining', 31500000, 34000000, 'Gỗ Sồi Tự Nhiên • Kính Gân Sọc Mờ', 'D1800 x R450 x C850 mm', 'Hệ cánh trượt êm khít ngăn bụi bếp, kính sọc mờ tạo hiệu ứng ẩn hiện thị giác cho bộ sưu tập gốm sứ thủ công.', 'THỦ CÔNG', '/images/dining-6.jpg', 3, 0),
('dining-6', 'KL-CRT-TEA', 'Xe Đẩy Pha Chế Teak Bar Cart', 'teak-bar-cart', 'cat-dining', 11200000, 12500000, 'Gỗ Teak Kháng Ẩm • Bánh Xe Mộc', 'D850 x R450 x C820 mm', 'Khay trên tháo rời làm khay bưng trà, gỗ teak tự tiết dầu kháng nước và chống mối mọt vĩnh viễn.', 'ĐA NĂNG', '/images/dining-7.jpg', 8, 0),

-- Phòng ngủ
('bed-1', 'KL-BED-ZEN', 'Giường Phản Gỗ Sồi Zen Platform Bed', 'zen-platform-bed', 'cat-bedroom', 24500000, 28000000, 'Gỗ Sồi Trắng • Mộng Kigumi', '1m8 x 2m (Chuẩn King)', 'Kết cấu ván phản phẳng liền mạch, lắp ráp hoàn toàn không dùng đinh kim loại, tẩm hương tuyết tùng xoa dịu thần kinh.', 'BẢO HÀNH 10 NĂM', '/images/bedroom-2.jpg', 7, 1),
('bed-2', 'KL-TAT-KYO', 'Chiếu Tatami Nhập Khẩu Nhật Bản', 'chieu-tatami-kyoto', 'cat-bedroom', 5200000, 6000000, 'Cỏ Igusa Tự Nhiên • Viền Vải Thô', '90cm x 180cm (Dày 5.5cm)', 'Hút ẩm tự nhiên, thanh lọc không khí trong phòng ngủ và tạo độ đàn hồi chuẩn mực cho hệ xương khớp khi ngủ.', 'NHẬP KHẨU KYOTO', '/images/bedroom-3.jpg', 14, 1),
('bed-3', 'KL-WAR-SHO', 'Hệ Tủ Áo Cửa Lùa Shoji Wardrobe', 'tu-ao-shoji', 'cat-bedroom', 42000000, 48000000, 'Khung Sồi • Giấy Washi Gia Cường & Kính', 'D2400 x C2600 mm (Kịch trần)', 'Cửa trượt êm ái phong cách nhà truyền thống Kyoto, hệ chia ngăn tối ưu theo thói quen gấp nếp tối giản.', 'THIẾT KẾ ĐỘC BẢN', '/images/bedroom-4.jpg', 3, 0),
('bed-4', 'KL-TAB-KAW', 'Tủ Đầu Giường Kawa Nightstand', 'tu-dau-giuong-kawa', 'cat-bedroom', 4800000, 5500000, 'Gỗ Sồi FAS • Ngăn Kéo Khớp Mộng', 'D500 x R400 x C480 mm', 'Hệ ray gỗ mộc không dùng phụ kiện kim loại kim khí, mặt trên bo cạnh tinh xảo đặt vừa vặn đèn ngủ giấy Wabi.', 'MỘNG GỖ MỘC', '/images/bedroom-5.jpg', 16, 0),
('bed-5', 'KL-VAN-KAN', 'Bàn Trang Điểm & Gương Kanso Vanity', 'ban-trang-diem-kanso', 'cat-bedroom', 18500000, 21000000, 'Gỗ Tần Bì Hun Khói • Gương Tròn Bo Viền', 'D1100 x R500 x C1350 mm', 'Mặt gương tròn Wabi-sabi lấy cảm hứng vầng trăng khuyết, tích hợp ngăn chứa trang sức bọc vải nhung nhám.', 'WABI-SABI', '/images/bedroom-6.jpg', 6, 0),
('bed-6', 'KL-BEN-NAM', 'Ghế Băng Đuôi Giường Nami Bench', 'ghe-bang-duoi-giuong', 'cat-bedroom', 7600000, 8500000, 'Gỗ Sồi • Đệm Cót Dệt Tay', 'D1400 x R400 x C450 mm', 'Điểm tựa chân giường hoàn hảo để đặt áo choàng hoặc tĩnh tọa đọc sách sáng sớm, đệm mây đan thoáng khí.', 'ĐAN THỦ CÔNG', '/images/bedroom-7.jpg', 9, 0);

-- 3. SEED SHOWROOMS
INSERT IGNORE INTO showrooms (id, name, address, city, phone, opening_hours) VALUES
('sr-hn-1', 'Komorebi Tây Hồ Atelier', 'Số 18 Phố Quảng An, Phường Quảng An, Tây Hồ', 'Hà Nội', '024 3892 8888', '08:30 - 20:30 (Thứ 2 - Chủ Nhật)'),
('sr-hcm-1', 'Komorebi Thảo Điền Space', '64 Đường Xuân Thủy, Phường Thảo Điền, TP. Thủ Đức', 'TP. Hồ Chí Minh', '028 3744 6699', '09:00 - 21:00 (Thứ 2 - Chủ Nhật)'),
('sr-dn-1', 'Komorebi Gallery Đà Nẵng', '128 Đường Bạch Đằng, Quận Hải Châu', 'Đà Nẵng', '0236 388 9966', '08:30 - 20:00 (Thứ 2 - Chủ Nhật)');

-- 4. SEED SAMPLE USERS
INSERT IGNORE INTO users (id, email, phone, full_name, role, is_fsc_certified) VALUES
('usr-admin-1', 'admin@komorebi.vn', '0901234567', 'Komorebi Studio Administrator', 'admin', 1),
('usr-arch-1', 'kts.minhtri@atelier.vn', '0988776655', 'KTS. Nguyễn Minh Trí', 'architect', 1),
('usr-client-1', 'khachhang@gmail.com', '0912345678', 'Trần Thảo Ly', 'client', 1);

-- 5. SEED SAMPLE CONSULTATION
INSERT IGNORE INTO consultations (id, full_name, phone, space_type, notes, status) VALUES
('con-sample-1', 'Phạm Hoàng Nam', '0933456789', 'Căn hộ cao cấp / Penthouse', 'Khảo sát căn hộ 145m2 tại Masteri Thảo Điền, muốn tư vấn trọn gói phòng khách và phòng ngủ phong cách Japandi tối giản.', 'new');
