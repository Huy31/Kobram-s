-- ==============================================================================
-- KOMOREBI ATELIER - SUPABASE DATABASE SCHEMA & POLICIES
-- HỆ THỐNG CƠ SỞ DỮ LIỆU TỐI ƯU HÓA HOÀN TOÀN CHO SUPABASE (POSTGRESQL)
-- Tích hợp sẵn: Supabase Auth, Row Level Security (RLS), Realtime & Seed Data
-- ==============================================================================

-- 0. KÍCH HOẠT EXTENSION HỖ TRỢ UUID & BẢO MẬT
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. HÀM TỰ ĐỘNG CẬP NHẬT UPDATED_AT (FUNCTION & TRIGGER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 2. TẠO CÁC BẢNG DỮ LIỆU (TABLES)
-- ==============================================================================

-- 2.1 BẢNG DANH MỤC KHÔNG GIAN (CATEGORIES)
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 BẢNG SẢN PHẨM MỘC BẢN (PRODUCTS)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    price NUMERIC(15, 2) NOT NULL,
    original_price NUMERIC(15, 2),
    material TEXT NOT NULL,
    dimensions TEXT,
    description TEXT,
    tag TEXT,
    image TEXT NOT NULL,
    stock_quantity INT DEFAULT 10,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 2.3 BẢNG ALBUM HÌNH ẢNH SẢN PHẨM (PRODUCT_IMAGES)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 BẢNG HỒ SƠ NGƯỜI DÙNG & HỘI VIÊN (PROFILES - LIÊN KẾT SUPABASE AUTH.USERS)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    phone TEXT,
    full_name TEXT,
    studio_name TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'architect', 'admin')),
    is_fsc_certified BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 2.5 BẢNG ĐƠN ĐẶT HÀNG (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    shipping_address TEXT NOT NULL,
    province TEXT,
    district TEXT,
    ward TEXT,
    order_note TEXT,
    subtotal NUMERIC(15, 2) NOT NULL,
    shipping_fee NUMERIC(15, 2) DEFAULT 0,
    discount_amount NUMERIC(15, 2) DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'vietqr', -- 'vietqr', 'cod', 'bank_transfer', 'credit_card'
    payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    order_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'manufacturing', 'shipping', 'completed', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 2.6 BẢNG CHI TIẾT ĐƠN HÀNG (ORDER_ITEMS)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    product_sku TEXT,
    product_image TEXT,
    selected_wood TEXT,
    selected_upholstery TEXT,
    selected_size TEXT,
    unit_price NUMERIC(15, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.7 BẢNG YÊU CẦU TƯ VẤN KIẾN TRÚC & MẶT BẰNG (CONSULTATIONS)
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT,
    phone TEXT NOT NULL,
    space_type TEXT NOT NULL, -- 'Căn hộ cao cấp / Penthouse', 'Nhà phố / Biệt thự', 'Không gian thương mại'
    notes TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.8 BẢNG DANH SÁCH YÊU THÍCH (WISHLISTS)
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_wishlist_product UNIQUE (user_id, product_id)
);

-- 2.9 BẢNG HỆ THỐNG SHOWROOM & ATELIER (SHOWROOMS)
CREATE TABLE IF NOT EXISTS public.showrooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    opening_hours TEXT NOT NULL,
    map_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG KÝ TÀI KHOẢN (SUPABASE AUTH TRIGGER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, phone, full_name, studio_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'studio_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'client')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger vào bảng auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 4. BẢO MẬT DỮ LIỆU CẤP HÀNG - ROW LEVEL SECURITY (RLS POLICIES)
-- ==============================================================================

-- Bật RLS cho tất cả các bảng
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showrooms ENABLE ROW LEVEL SECURITY;

-- 4.1 POLICIES CHO CATEGORIES
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin Modify Categories" ON public.categories FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- 4.2 POLICIES CHO PRODUCTS
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admin Modify Products" ON public.products FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- 4.3 POLICIES CHO PRODUCT IMAGES
CREATE POLICY "Public Read Product Images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admin Modify Product Images" ON public.product_images FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- 4.4 POLICIES CHO PROFILES
CREATE POLICY "Public/User Read Profiles" ON public.profiles FOR SELECT USING (
    auth.uid() = id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);
CREATE POLICY "User Update Own Profile" ON public.profiles FOR UPDATE USING (
    auth.uid() = id
) WITH CHECK (
    auth.uid() = id
);

-- 4.5 POLICIES CHO ORDERS
-- Khách vãng lai hoặc hội viên đều có thể tạo đơn hàng
CREATE POLICY "Anyone Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
-- Người dùng xem đơn hàng của chính mình (hoặc Admin xem tất cả)
CREATE POLICY "User View Own Orders" ON public.orders FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);
-- Admin được sửa đơn hàng
CREATE POLICY "Admin Update Orders" ON public.orders FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- 4.6 POLICIES CHO ORDER ITEMS
CREATE POLICY "Anyone Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "User View Order Items" ON public.order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
    )
);

-- 4.7 POLICIES CHO CONSULTATIONS (TƯ VẤN)
-- Bất kỳ ai vào web cũng có thể gửi form đăng ký tư vấn
CREATE POLICY "Anyone Insert Consultation" ON public.consultations FOR INSERT WITH CHECK (true);
-- Chỉ Admin mới có quyền xem và xử lý các yêu cầu tư vấn
CREATE POLICY "Admin View Consultations" ON public.consultations FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);
CREATE POLICY "Admin Update Consultations" ON public.consultations FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- 4.8 POLICIES CHO WISHLISTS
CREATE POLICY "User View Own Wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User Insert Own Wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User Delete Own Wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- 4.9 POLICIES CHO SHOWROOMS
CREATE POLICY "Public Read Showrooms" ON public.showrooms FOR SELECT USING (true);

-- ==============================================================================
-- 5. KÍCH HOẠT SUPABASE REALTIME (TÙY CHỌN CHO ĐƠN HÀNG VÀ TƯ VẤN)
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultations;

-- ==============================================================================
-- 6. TẠO INDEXES TỐI ƯU TRUY VẤN
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_code ON public.orders(order_code);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);

-- ==============================================================================
-- 7. DỮ LIỆU SEED MẪU (SEED DATA THEO CHUẨN POSTGRESQL / SUPABASE)
-- ==============================================================================

-- 7.1 SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, description, sort_order) VALUES
('cat-living', 'Không Gian Phòng Khách', 'phong-khach', 'Tuyển tập các tác phẩm nội thất mộc bản cho gian khách đương đại phong cách Japandi Wabi-sabi.', 1),
('cat-dining', 'Không Gian Phòng Bếp & Ăn', 'phong-bep', 'Bàn ăn mở rộng, ghế ăn công thái học chế tác từ gỗ sồi và tần bì nguyên khối.', 2),
('cat-bedroom', 'Không Gian Phòng Ngủ', 'phong-ngu', 'Giường phản mộng Kigumi, chiếu Tatami Kyoto thanh lọc không gian tĩnh tại.', 3),
('cat-collection', 'Bộ Sưu Tập Signature', 'bo-suu-tap', 'Các thiết kế độc bản kết hợp giữa kỹ nghệ mộc truyền thống và công năng đương đại.', 4),
('cat-architecture', 'Dự Án Kiến Trúc', 'du-an-kien-truc', 'Công trình nhà phố, biệt thự và penthouse ứng dụng triết lý khoảng trống Ma (間).', 5)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description;

-- 7.2 SEED PRODUCTS (TOÀN BỘ 19+ SẢN PHẨM THỰC TẾ TRONG DỰ ÁN)
INSERT INTO public.products (id, sku, title, slug, category_id, price, original_price, material, dimensions, description, tag, image, stock_quantity, is_featured) VALUES
-- Phòng khách
('living-1', 'KL-SOF-NAM', 'Sofa Ba Chỗ Gỗ Sồi Nami', 'sofa-go-soi-nami', 'cat-living', 28500000, 32000000, 'Gỗ Sồi Trắng Bắc Mỹ • Vải Lanh Mộc', 'D2200 x R880 x C720 mm', 'Đệm mút đàn hồi cao bọc sợi tự nhiên 100%, khung gỗ sồi gia công liên kết mộng âm dương không đinh ốc.', 'BÁN CHẠY NHẤT', '/images/living-1.jpg', 8, TRUE),
('living-2', 'KL-TAB-ENS', 'Bàn Trà Tròn Enso', 'ban-tra-tron-enso', 'cat-living', 12200000, 14000000, 'Gỗ Tần Bì Hun Khói • Dáng Tròn Wabi', 'D900 x C350 mm', 'Mặt bàn tròn bo viền vát cạnh mềm mại, chân đế ba điểm vững chãi mang đậm dấu ấn thiền định tối giản.', 'GỖ NGUYÊN KHỐI', '/images/living-2.jpg', 12, TRUE),
('living-3', 'KL-LOU-01', 'Ghế Bành Thư Giãn Kura', 'kura-lounge-chair', 'cat-living', 14800000, 16500000, 'Gỗ Óc Chó Walnut • Da Bò Thuộc Thảo Mộc', 'D840 x R760 x C780 mm', 'Độ nghiêng 105 độ công thái học nâng đỡ đốt sống lưng, khung gỗ óc chó đánh sáp thực vật tự nhiên.', 'THIẾT KẾ ĐỘC BẢN', '/images/living-3.jpg', 6, TRUE),
('living-4', 'KL-CAB-KAW', 'Kệ Tivi Treo Tường Kawa', 'ke-tivi-kawa', 'cat-living', 19400000, 22000000, 'Gỗ Sồi Tự Nhiên • Ngăn Kéo Khớp Mộng', 'D2000 x R400 x C320 mm', 'Hệ ray âm giảm chấn Hafele, mặt cánh lật kết hợp lam gỗ tạo khe thông gió giải nhiệt cho thiết bị âm thanh.', 'TREO TƯỜNG', '/images/living-4.jpg', 5, FALSE),
('living-5', 'KL-POU-TAT', 'Đệm Ngồi Thiền Tatami Pouf', 'tatami-reading-pouf', 'cat-living', 3600000, 4200000, 'Vải Thô Dệt Tay • Ruột Bông Gòn Hữu Cơ', 'D600 x R600 x C250 mm', 'Tạo góc tĩnh tọa bên cửa sổ hoặc bàn trà thấp, bề mặt dệt thô mộc xơ lanh kháng khuẩn tự nhiên.', 'THỦ CÔNG', '/images/living-5.jpg', 20, FALSE),
('living-6', 'KL-SHE-SOR', 'Tủ Kệ Sách Kiến Trúc Sora', 'tu-ke-sach-sora', 'cat-living', 34000000, 38000000, 'Gỗ Sồi Trắng Bắc Mỹ • Khung Rỗng Thoáng', 'D1600 x R380 x C2100 mm', 'Phân chia không gian ước lệ bằng nhịp điệu hình học không có hậu tủ, cho phép ánh sáng xuyên qua tự nhiên.', 'KẾT CẤU KIGUMI', '/images/living-6.jpg', 4, FALSE),
('living-7', 'KL-SOF-GOC', 'Sofa Góc Chữ L Nỉ Cao Cấp', 'sofa-goc-ni-chu-l-cao-cap', 'cat-living', 35800000, 39500000, 'Gỗ Sồi Tự Nhiên • Vải Nỉ Cao Cấp', 'D2800 x R1600 x C820 mm', 'Cấu trúc chữ L ôm trọn không gian phòng khách, đệm mút đàn hồi cao chống xẹp lún kết hợp vải nỉ dệt cao cấp êm ái.', 'MẪU MỚI', '/images/bo-sofa-ni-goc-hinh-chu-l-cho-phong-khach-cao-cap.jpg', 7, TRUE),

-- Phòng ăn & bếp
('dining-1', 'KL-TAB-18', 'Bàn Ăn Mở Rộng Mori Oak (1.8m - 2.4m)', 'mori-oak-table', 'cat-dining', 24500000, 26800000, 'Gỗ Sồi Trắng Bắc Mỹ • Mộng Âm Dương', 'D1800-2400 x R900 x C750 mm', 'Cơ cấu ray trượt gỗ sồi chịu tải không phụ thuộc kim loại cơ học, chống kẹt ray và hạn chế rung lắc tuyệt đối.', 'GỖ SỒI BẮC MỸ', '/images/dining-2.jpg', 9, TRUE),
('dining-2', 'KL-CHA-KAN', 'Bộ 4 Ghế Ăn Tối Giản Kanso', 'ghe-an-kanso', 'cat-dining', 16800000, 18500000, 'Gỗ Sồi FAS • Đệm Da Bò Sáp Ý', 'D480 x R520 x C800 mm', 'Đường cong tựa lưng tạo điểm tì êm ái cho bữa ăn gia đình kéo dài, bọc da sáp chống bám dầu mỡ tự nhiên.', 'BÁN CHẠY NHẤT', '/images/dining-3.jpg', 15, TRUE),
('dining-3', 'KL-TAB-ENS-D', 'Bàn Ăn Tròn Tĩnh Tọa Enso (ĐK 1.4m)', 'ban-an-tron-enso', 'cat-dining', 29000000, 32000000, 'Gỗ Óc Chó Walnut Bắc Mỹ Nguyên Tấm', 'D1400 x C750 mm', 'Dáng tròn tụ khí đoàn viên, giác gỗ chuyển tiếp màu nâu socola trầm ấm đánh bóng bằng dầu lau thực vật tự nhiên.', 'NGUYÊN KHỐI', '/images/dining-4.jpg', 5, FALSE),
('dining-4', 'KL-BEN-SOL', 'Ghế Băng Dài Gỗ Sồi Mộc Bản', 'ghe-bang-go-soi', 'cat-dining', 8900000, 9800000, 'Gỗ Sồi Tự Nhiên • Dài 1.6m', 'D1600 x R380 x C450 mm', 'Giải pháp ngồi linh hoạt cho bàn ăn gia đình đông thành viên, vát cạnh mộc mạc chống va quẹt cho trẻ nhỏ.', 'TIỆN ÍCH', '/images/dining-5.jpg', 11, FALSE),
('dining-5', 'KL-CAB-MIZ', 'Tủ Chén Bát Mizu Sideboard', 'tu-chen-mizu', 'cat-dining', 31500000, 34000000, 'Gỗ Sồi Tự Nhiên • Kính Gân Sọc Mờ', 'D1800 x R450 x C850 mm', 'Hệ cánh trượt êm khít ngăn bụi bếp, kính sọc mờ tạo hiệu ứng ẩn hiện thị giác cho bộ sưu tập gốm sứ thủ công.', 'THỦ CÔNG', '/images/dining-6.jpg', 3, FALSE),
('dining-6', 'KL-CRT-TEA', 'Xe Đẩy Pha Chế Teak Bar Cart', 'teak-bar-cart', 'cat-dining', 11200000, 12500000, 'Gỗ Teak Kháng Ẩm • Bánh Xe Mộc', 'D850 x R450 x C820 mm', 'Khay trên tháo rời làm khay bưng trà, gỗ teak tự tiết dầu kháng nước và chống mối mọt vĩnh viễn.', 'ĐA NĂNG', '/images/dining-7.jpg', 8, FALSE),

-- Phòng ngủ
('bed-1', 'KL-BED-ZEN', 'Giường Phản Gỗ Sồi Zen Platform Bed', 'zen-platform-bed', 'cat-bedroom', 24500000, 28000000, 'Gỗ Sồi Trắng • Mộng Kigumi', '1m8 x 2m (Chuẩn King)', 'Kết cấu ván phản phẳng liền mạch, lắp ráp hoàn toàn không dùng đinh kim loại, tẩm hương tuyết tùng xoa dịu thần kinh.', 'BẢO HÀNH 10 NĂM', '/images/bedroom-2.jpg', 7, TRUE),
('bed-2', 'KL-TAT-KYO', 'Chiếu Tatami Nhập Khẩu Nhật Bản', 'chieu-tatami-kyoto', 'cat-bedroom', 5200000, 6000000, 'Cỏ Igusa Tự Nhiên • Viền Vải Thô', '90cm x 180cm (Dày 5.5cm)', 'Hút ẩm tự nhiên, thanh lọc không khí trong phòng ngủ và tạo độ đàn hồi chuẩn mực cho hệ xương khớp khi ngủ.', 'NHẬP KHẨU KYOTO', '/images/bedroom-3.jpg', 14, TRUE),
('bed-3', 'KL-WAR-SHO', 'Hệ Tủ Áo Cửa Lùa Shoji Wardrobe', 'tu-ao-shoji', 'cat-bedroom', 42000000, 48000000, 'Khung Sồi • Giấy Washi Gia Cường & Kính', 'D2400 x C2600 mm (Kịch trần)', 'Cửa trượt êm ái phong cách nhà truyền thống Kyoto, hệ chia ngăn tối ưu theo thói quen gấp nếp tối giản.', 'THIẾT KẾ ĐỘC BẢN', '/images/bedroom-4.jpg', 3, FALSE),
('bed-4', 'KL-TAB-KAW', 'Tủ Đầu Giường Kawa Nightstand', 'tu-dau-giuong-kawa', 'cat-bedroom', 4800000, 5500000, 'Gỗ Sồi FAS • Ngăn Kéo Khớp Mộng', 'D500 x R400 x C480 mm', 'Hệ ray gỗ mộc không dùng phụ kiện kim loại kim khí, mặt trên bo cạnh tinh xảo đặt vừa vặn đèn ngủ giấy Wabi.', 'MỘNG GỖ MỘC', '/images/bedroom-5.jpg', 16, FALSE),
('bed-5', 'KL-VAN-KAN', 'Bàn Trang Điểm & Gương Kanso Vanity', 'ban-trang-diem-kanso', 'cat-bedroom', 18500000, 21000000, 'Gỗ Tần Bì Hun Khói • Gương Tròn Bo Viền', 'D1100 x R500 x C1350 mm', 'Mặt gương tròn Wabi-sabi lấy cảm hứng vầng trăng khuyết, tích hợp ngăn chứa trang sức bọc vải nhung nhám.', 'WABI-SABI', '/images/bedroom-6.jpg', 6, FALSE),
('bed-6', 'KL-BEN-NAM', 'Ghế Băng Đuôi Giường Nami Bench', 'ghe-bang-duoi-giuong', 'cat-bedroom', 7600000, 8500000, 'Gỗ Sồi • Đệm Cót Dệt Tay', 'D1400 x R400 x C450 mm', 'Điểm tựa chân giường hoàn hảo để đặt áo choàng hoặc tĩnh tọa đọc sách sáng sớm, đệm mây đan thoáng khí.', 'ĐAN THỦ CÔNG', '/images/bedroom-7.jpg', 9, FALSE)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    material = EXCLUDED.material,
    image = EXCLUDED.image,
    dimensions = EXCLUDED.dimensions,
    description = EXCLUDED.description;

-- 7.3 SEED SHOWROOMS
INSERT INTO public.showrooms (id, name, address, city, phone, opening_hours) VALUES
('sr-hn-1', 'Komorebi Tây Hồ Atelier', 'Số 18 Phố Quảng An, Phường Quảng An, Tây Hồ', 'Hà Nội', '024 3892 8888', '08:30 - 20:30 (Thứ 2 - Chủ Nhật)'),
('sr-hcm-1', 'Komorebi Thảo Điền Space', '64 Đường Xuân Thủy, Phường Thảo Điền, TP. Thủ Đức', 'TP. Hồ Chí Minh', '028 3744 6699', '09:00 - 21:00 (Thứ 2 - Chủ Nhật)'),
('sr-dn-1', 'Komorebi Gallery Đà Nẵng', '128 Đường Bạch Đằng, Quận Hải Châu', 'Đà Nẵng', '0236 388 9966', '08:30 - 20:00 (Thứ 2 - Chủ Nhật)')
ON CONFLICT (id) DO NOTHING;

-- 7.4 SEED SAMPLE CONSULTATION (YÊU CẦU TƯ VẤN MẪU)
INSERT INTO public.consultations (full_name, phone, space_type, notes, status) VALUES
('Phạm Hoàng Nam', '0933456789', 'Căn hộ cao cấp / Penthouse', 'Khảo sát căn hộ 145m2 tại Masteri Thảo Điền, muốn tư vấn trọn gói phòng khách và phòng ngủ phong cách Japandi tối giản.', 'new');
