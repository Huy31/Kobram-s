-- ==============================================================================
-- BẢN CẬP NHẬT DATABASE CHO SUPABASE (PROFILES & FACEBOOK / GOOGLE OAUTH)
-- Chạy đoạn mã này trong Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Bổ sung các cột mới cho bảng public.profiles (An toàn, không mất dữ liệu cũ)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dob DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'Nam';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tax_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fav_styles TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_wood TEXT DEFAULT 'Gỗ Sồi Trắng Bắc Mỹ (White Oak)';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS care_frequency TEXT DEFAULT 'Mỗi 6 tháng (Komorebi Khuyến nghị)';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS addresses JSONB DEFAULT '[]'::jsonb;

-- Đảm bảo cột role có giá trị mặc định là 'client' (Khách hàng)
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'client';

-- 2. Cập nhật Trigger tự động ghi nhận hội viên khi đăng nhập qua Facebook hoặc Google
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        email, 
        phone, 
        full_name, 
        studio_name, 
        company, 
        role, 
        avatar_url
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'studio_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'company', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_user_meta_data->>'picture',
            NEW.raw_user_meta_data->'picture'->'data'->>'url',
            ''
        )
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
        avatar_url = COALESCE(NULLIF(EXCLUDED.avatar_url, ''), public.profiles.avatar_url);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger vào bảng auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 3. Đảm bảo chính sách phân quyền RLS cho phép người dùng tự lưu/cập nhật hồ sơ (Upsert)
DROP POLICY IF EXISTS "User Insert Own Profile" ON public.profiles;
CREATE POLICY "User Insert Own Profile" ON public.profiles FOR INSERT WITH CHECK (
    auth.uid() = id
);

DROP POLICY IF EXISTS "User Update Own Profile" ON public.profiles;
CREATE POLICY "User Update Own Profile" ON public.profiles FOR UPDATE USING (
    auth.uid() = id
) WITH CHECK (
    auth.uid() = id
);

DROP POLICY IF EXISTS "Public/User Read Profiles" ON public.profiles;
CREATE POLICY "Public/User Read Profiles" ON public.profiles FOR SELECT USING (
    auth.uid() = id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);
