import { createClient } from "@/utils/supabase/client";

export interface DbProduct {
  id: string;
  sku: string;
  title: string;
  slug: string;
  category_id: string;
  price: number;
  original_price?: number;
  material: string;
  dimensions?: string;
  description?: string;
  tag?: string;
  image: string;
  stock_quantity?: number;
  is_featured?: boolean;
  gallery?: Array<{ id: string; label: string; src: string; desc?: string }>;
}

/**
 * Lấy chi tiết một sản phẩm theo slug trực tiếp từ Supabase Database
 */
export async function getProductBySlug(slug: string): Promise<DbProduct | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      const gallery =
        data.product_images && data.product_images.length > 0
          ? data.product_images.map((img: any) => ({
              id: img.id,
              label: img.alt_text || "Chi tiết sản phẩm",
              src: img.image_url,
              desc: img.alt_text || "",
            }))
          : [
              {
                id: "main-1",
                label: "Chính diện",
                src: data.image,
                desc: data.description || "Góc nhìn chính diện phô diễn tỷ lệ hình học cân bằng.",
              },
              {
                id: "joinery-2",
                label: "Mộng gỗ",
                src: "/images/kura-joinery.jpg",
                desc: "Kỹ thuật mộng âm dương Kigumi không dùng đinh kim loại.",
              },
              {
                id: "angle-3",
                label: "Góc nghiêng",
                src: "/images/kura-angle.jpg",
                desc: "Độ nghiêng công thái học nâng đỡ cột sống hoàn hảo.",
              },
              {
                id: "room-4",
                label: "Phối cảnh mẫu",
                src: "/images/kura-room.jpg",
                desc: "Không gian ánh sáng tự nhiên Komorebi Living.",
              },
            ];

      return {
        id: data.id,
        sku: data.sku,
        title: data.title,
        slug: data.slug,
        category_id: data.category_id,
        price: Number(data.price),
        original_price: data.original_price ? Number(data.original_price) : undefined,
        material: data.material,
        dimensions: data.dimensions || "",
        description: data.description || "",
        tag: data.tag || "",
        image: data.image,
        stock_quantity: data.stock_quantity,
        is_featured: data.is_featured,
        gallery,
      };
    }
  } catch (err) {
    console.warn(`[Supabase] Không thể nạp sản phẩm slug ${slug}:`, err);
  }
  return null;
}

/**
 * Lấy toàn bộ sản phẩm từ Supabase Database
 */
export async function getAllProducts<T>(
  fallbackList: T[],
  mapFn: (dbItem: DbProduct) => T
): Promise<T[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return (data as any[]).map((row) =>
        mapFn({
          id: row.id,
          sku: row.sku,
          title: row.title,
          slug: row.slug,
          category_id: row.category_id,
          price: Number(row.price),
          original_price: row.original_price ? Number(row.original_price) : undefined,
          material: row.material,
          dimensions: row.dimensions || "",
          description: row.description || "",
          tag: row.tag || "",
          image: row.image,
          stock_quantity: row.stock_quantity,
          is_featured: row.is_featured,
        })
      );
    }
  } catch (err) {
    console.warn("[Supabase] Lỗi tải danh sách sản phẩm:", err);
  }
  return fallbackList;
}

/**
 * Lấy danh sách đơn hàng của người dùng từ Supabase Database
 */
export async function getUserOrders(userId?: string): Promise<any[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn("[Supabase] Lỗi nạp đơn hàng:", err);
  }
  return [];
}

/**
 * Lấy danh sách sản phẩm theo Category từ Supabase
 * Tự động dự phòng dữ liệu fallback nếu Supabase chưa có bảng hoặc chưa cấu hình
 */
export async function getProductsByCategory<T>(
  categoryId: string,
  fallbackList: T[],
  mapFn: (dbItem: DbProduct) => T
): Promise<T[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return (data as any[]).map((row) =>
        mapFn({
          id: row.id,
          sku: row.sku,
          title: row.title,
          slug: row.slug,
          category_id: row.category_id,
          price: Number(row.price),
          original_price: row.original_price ? Number(row.original_price) : undefined,
          material: row.material,
          dimensions: row.dimensions || "",
          description: row.description || "",
          tag: row.tag || "",
          image: row.image,
          stock_quantity: row.stock_quantity,
          is_featured: row.is_featured,
        })
      );
    }
  } catch (err) {
    console.warn(`[Supabase] Không thể nạp category ${categoryId}, dùng dữ liệu dự phòng.`, err);
  }

  return fallbackList;
}

/**
 * Lấy danh sách sản phẩm nổi bật cho Trang Chủ từ Supabase
 */
export async function getFeaturedProducts<T>(
  fallbackList: T[],
  mapFn: (dbItem: DbProduct) => T
): Promise<T[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .limit(8);

    if (!error && data && data.length > 0) {
      return (data as any[]).map((row) =>
        mapFn({
          id: row.id,
          sku: row.sku,
          title: row.title,
          slug: row.slug,
          category_id: row.category_id,
          price: Number(row.price),
          original_price: row.original_price ? Number(row.original_price) : undefined,
          material: row.material,
          dimensions: row.dimensions || "",
          description: row.description || "",
          tag: row.tag || "",
          image: row.image,
          stock_quantity: row.stock_quantity,
          is_featured: row.is_featured,
        })
      );
    }
  } catch (err) {
    console.warn("[Supabase] Lỗi tải sản phẩm nổi bật:", err);
  }

  return fallbackList;
}

/**
 * Gửi yêu cầu tư vấn khảo sát mặt bằng lên Supabase
 */
export async function submitConsultationToDb(params: {
  fullName?: string;
  phone: string;
  spaceType: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("consultations").insert({
      full_name: params.fullName || "",
      phone: params.phone,
      space_type: params.spaceType,
      notes: params.notes || "",
    });

    if (error) {
      console.error("[Supabase] Lỗi lưu tư vấn:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("[Supabase] Exception lưu tư vấn:", err);
    return { success: false, error: err?.message || "Lỗi không xác định" };
  }
}

/**
 * Gửi đơn đặt hàng lên Supabase
 */
export async function submitOrderToDb(params: {
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  subtotal: number;
  totalAmount: number;
  paymentMethod: string;
  orderNote?: string;
  items: Array<{
    productId?: string;
    productTitle: string;
    productSku?: string;
    productImage?: string;
    selectedWood?: string;
    selectedUpholstery?: string;
    selectedSize?: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }>;
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const supabase = createClient();

    // 1. Tạo đơn hàng chính
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_code: params.orderCode,
        customer_name: params.customerName,
        customer_phone: params.customerPhone,
        customer_email: params.customerEmail,
        shipping_address: params.shippingAddress,
        subtotal: params.subtotal,
        total_amount: params.totalAmount,
        payment_method: params.paymentMethod,
        payment_status: "pending",
        order_status: "pending",
        order_note: params.orderNote,
      })
      .select("id")
      .single();

    if (orderError || !orderData) {
      console.error("[Supabase] Lỗi tạo đơn hàng:", orderError);
      return { success: false, error: orderError?.message };
    }

    // 2. Tạo chi tiết đơn hàng (order_items)
    if (params.items && params.items.length > 0) {
      const itemsPayload = params.items.map((it) => ({
        order_id: orderData.id,
        product_id: it.productId,
        product_title: it.productTitle,
        product_sku: it.productSku,
        product_image: it.productImage,
        selected_wood: it.selectedWood,
        selected_upholstery: it.selectedUpholstery,
        selected_size: it.selectedSize,
        unit_price: it.unitPrice,
        quantity: it.quantity,
        subtotal: it.subtotal,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);
      if (itemsError) {
        console.error("[Supabase] Lỗi tạo chi tiết đơn hàng:", itemsError);
      }
    }

    return { success: true, orderId: orderData.id };
  } catch (err: any) {
    console.error("[Supabase] Exception lưu đơn hàng:", err);
    return { success: false, error: err?.message };
  }
}
