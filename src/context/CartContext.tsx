"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  options?: {
    wood?: string;
    upholstery?: string;
    size?: string;
    notes?: string;
  };
}

export interface WishlistItem {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  material?: string;
  slug: string;
}

export const masterCatalog: Record<string, WishlistItem> = {
  "p1": {
    id: "p1",
    sku: "KL-LOU-01",
    title: "Ghế Thư Giãn Kura",
    subtitle: "Kura Lounge Chair • Sồi Tự Nhiên",
    price: 14800000,
    originalPrice: 17500000,
    image: "/images/product-kura-chair.jpg",
    category: "Phòng Khách",
    material: "Gỗ Sồi Trắng Bắc Mỹ",
    slug: "kura-lounge-chair",
  },
  "kura-lounge-chair": {
    id: "kura-lounge-chair",
    sku: "KL-LOU-01",
    title: "Ghế Thư Giãn Kura Lounge Chair",
    subtitle: "Kura Lounge Chair • Sồi Tự Nhiên",
    price: 14800000,
    originalPrice: 17500000,
    image: "/images/product-kura-chair.jpg",
    category: "Phòng Khách",
    material: "Gỗ Sồi Trắng Bắc Mỹ",
    slug: "kura-lounge-chair",
  },
  "p2": {
    id: "p2",
    sku: "KL-SOF-02",
    title: "Sofa Nỉ Nordic Cloud",
    subtitle: "Khung Gỗ Thông • Đệm Lông Vũ",
    price: 32600000,
    originalPrice: 36000000,
    image: "/images/product-nordic-sofa.jpg",
    category: "Phòng Khách",
    material: "Vải Linen Tự Nhiên",
    slug: "nordic-cloud-sofa",
  },
  "p3": {
    id: "p3",
    sku: "KL-TAB-18",
    title: "Bàn Ăn Mori Oak Table",
    subtitle: "Mặt Mở Rộng 1.8m - 2.4m",
    price: 24500000,
    originalPrice: 26800000,
    image: "/images/product-mori-table.jpg",
    category: "Phòng Ăn",
    material: "Gỗ Sồi Trắng FSC",
    slug: "mori-oak-table",
  },
  "p4": {
    id: "p4",
    sku: "KL-LGT-09",
    title: "Đèn Thả Wabi Paper",
    subtitle: "Khung Tre Tự Nhiên • LED 2700K",
    price: 4200000,
    originalPrice: 4900000,
    image: "/images/product-wabi-lamp.jpg",
    category: "Phòng Ăn",
    material: "Giấy Washi Thủ Công",
    slug: "wabi-paper-lamp",
  },
  "p5": {
    id: "p5",
    sku: "KL-COF-05",
    title: "Bàn Trà Kanso Coffee Table",
    subtitle: "Gỗ Walnut Bắc Mỹ Khối Liền",
    price: 16200000,
    originalPrice: 18500000,
    image: "/images/kura-room.jpg",
    category: "Phòng Khách",
    material: "Gỗ Walnut",
    slug: "kanso-coffee-table",
  },
  "p6": {
    id: "p6",
    sku: "KL-BED-08",
    title: "Giường Ngủ Zen Platform Bed",
    subtitle: "Khung Sồi Tự Nhiên • Mộng Kigumi",
    price: 28900000,
    originalPrice: 32000000,
    image: "/images/kura-front.jpg",
    category: "Phòng Ngủ",
    material: "Da bò Ý & Gỗ Sồi",
    slug: "zen-platform-bed",
  },
  "living-1": {
    id: "living-1",
    sku: "KL-SOF-NAM",
    title: "Sofa Ba Chỗ Gỗ Sồi Nami",
    subtitle: "Gỗ Sồi Trắng Bắc Mỹ • Vải Lanh Mộc",
    price: 28500000,
    originalPrice: 32000000,
    image: "/images/living-1.jpg",
    category: "Phòng Khách",
    material: "Gỗ Sồi Trắng Bắc Mỹ",
    slug: "sofa-go-soi-nami",
  },
  "living-2": {
    id: "living-2",
    sku: "KL-TAB-ENS",
    title: "Bàn Trà Tròn Enso",
    subtitle: "Gỗ Tần Bì Hun Khói • Dáng Tròn Wabi",
    price: 12200000,
    originalPrice: 14000000,
    image: "/images/living-2.jpg",
    category: "Phòng Khách",
    material: "Gỗ Tần Bì",
    slug: "ban-tra-tron-enso",
  },
  "living-3": {
    id: "living-3",
    sku: "KL-LOU-01",
    title: "Ghế Bành Thư Giãn Kura",
    subtitle: "Gỗ Óc Chó Walnut • Da Bò Thuộc Thảo Mộc",
    price: 14800000,
    originalPrice: 16500000,
    image: "/images/living-3.jpg",
    category: "Phòng Khách",
    material: "Gỗ Óc Chó Walnut",
    slug: "kura-lounge-chair",
  },
  "living-4": {
    id: "living-4",
    sku: "KL-CAB-KAW",
    title: "Kệ Tivi Treo Tường Kawa",
    subtitle: "Gỗ Sồi Tự Nhiên • Ngăn Kéo Khớp Mộng",
    price: 19400000,
    originalPrice: 22000000,
    image: "/images/living-4.jpg",
    category: "Phòng Khách",
    material: "Gỗ Sồi Tự Nhiên",
    slug: "ke-tivi-kawa",
  },
  "living-5": {
    id: "living-5",
    sku: "KL-POU-TAT",
    title: "Đệm Ngồi Thiền Tatami Pouf",
    subtitle: "Vải Thô Dệt Tay • Ruột Bông Hữu Cơ",
    price: 3600000,
    originalPrice: 4200000,
    image: "/images/living-5.jpg",
    category: "Phòng Khách",
    material: "Vải Thô Dệt Tay",
    slug: "tatami-reading-pouf",
  },
  "living-6": {
    id: "living-6",
    sku: "KL-SHE-SOR",
    title: "Tủ Kệ Sách Kiến Trúc Sora",
    subtitle: "Gỗ Sồi Trắng FAS • Khung Rỗng Thoáng",
    price: 34000000,
    originalPrice: 38000000,
    image: "/images/living-6.jpg",
    category: "Phòng Khách",
    material: "Gỗ Sồi Trắng FAS",
    slug: "tu-ke-sach-sora",
  },
  "living-7": {
    id: "living-7",
    sku: "KL-SOF-GOC",
    title: "Sofa Góc Chữ L Nỉ Cao Cấp",
    subtitle: "Gỗ Sồi Tự Nhiên • Vải Nỉ Cao Cấp",
    price: 35800000,
    originalPrice: 39500000,
    image: "/images/bo-sofa-ni-goc-hinh-chu-l-cho-phong-khach-cao-cap.jpg",
    category: "Phòng Khách",
    material: "Gỗ Sồi Tự Nhiên",
    slug: "sofa-goc-ni-chu-l-cao-cap",
  },
  "sofa-goc-ni-chu-l-cao-cap": {
    id: "living-7",
    sku: "KL-SOF-GOC",
    title: "Sofa Góc Chữ L Nỉ Cao Cấp",
    subtitle: "Gỗ Sồi Tự Nhiên • Vải Nỉ Cao Cấp",
    price: 35800000,
    originalPrice: 39500000,
    image: "/images/bo-sofa-ni-goc-hinh-chu-l-cho-phong-khach-cao-cap.jpg",
    category: "Phòng Khách",
    material: "Gỗ Sồi Tự Nhiên",
    slug: "sofa-goc-ni-chu-l-cao-cap",
  },
  "dining-1": {
    id: "dining-1",
    sku: "KL-TAB-18",
    title: "Bàn Ăn Mở Rộng Mori Oak (1.8m - 2.4m)",
    subtitle: "Gỗ Sồi Trắng Bắc Mỹ • Mộng Âm Dương",
    price: 24500000,
    originalPrice: 26800000,
    image: "/images/dining-2.jpg",
    category: "Phòng Ăn",
    material: "Gỗ Sồi Trắng Bắc Mỹ",
    slug: "mori-oak-table",
  },
  "dining-2": {
    id: "dining-2",
    sku: "KL-CHA-KAN",
    title: "Bộ 4 Ghế Ăn Tối Giản Kanso",
    subtitle: "Gỗ Sồi FAS • Đệm Da Bò Sáp Ý",
    price: 16800000,
    originalPrice: 18500000,
    image: "/images/dining-3.jpg",
    category: "Phòng Ăn",
    material: "Gỗ Sồi FAS",
    slug: "ghe-an-kanso",
  },
  "dining-3": {
    id: "dining-3",
    sku: "KL-TAB-ENS",
    title: "Bàn Ăn Tròn Tĩnh Tọa Enso (ĐK 1.4m)",
    subtitle: "Gỗ Óc Chó Walnut Bắc Mỹ Nguyên Tấm",
    price: 29000000,
    originalPrice: 32000000,
    image: "/images/dining-4.jpg",
    category: "Phòng Ăn",
    material: "Gỗ Óc Chó Walnut",
    slug: "ban-an-tron-enso",
  },
  "dining-4": {
    id: "dining-4",
    sku: "KL-BEN-SOL",
    title: "Ghế Băng Dài Gỗ Sồi Mộc Bản",
    subtitle: "Gỗ Sồi Tự Nhiên • Dài 1.6m",
    price: 8900000,
    originalPrice: 9800000,
    image: "/images/dining-5.jpg",
    category: "Phòng Ăn",
    material: "Gỗ Sồi Tự Nhiên",
    slug: "ghe-bang-go-soi",
  },
  "dining-5": {
    id: "dining-5",
    sku: "KL-CAB-MIZ",
    title: "Tủ Chén Bát Mizu Sideboard",
    subtitle: "Gỗ Sồi & Kính Gân Sọc Mờ",
    price: 31500000,
    originalPrice: 34000000,
    image: "/images/dining-6.jpg",
    category: "Phòng Ăn",
    material: "Gỗ Sồi & Kính",
    slug: "tu-chen-mizu",
  },
  "dining-6": {
    id: "dining-6",
    sku: "KL-CRT-TEA",
    title: "Xe Đẩy Pha Chế Teak Bar Cart",
    subtitle: "Gỗ Teak Kháng Ẩm • Bánh Xe Mộc",
    price: 11200000,
    originalPrice: 12500000,
    image: "/images/dining-7.jpg",
    category: "Phòng Ăn",
    material: "Gỗ Teak",
    slug: "teak-bar-cart",
  },
  "bed-1": {
    id: "bed-1",
    sku: "KL-BED-ZEN",
    title: "Giường Phản Gỗ Sồi Zen Platform Bed",
    subtitle: "Gỗ Sồi Trắng • Mộng Kigumi",
    price: 24500000,
    originalPrice: 28000000,
    image: "/images/bedroom-2.jpg",
    category: "Phòng Ngủ",
    material: "Gỗ Sồi Trắng",
    slug: "zen-platform-bed",
  },
  "bed-2": {
    id: "bed-2",
    sku: "KL-TAT-KYO",
    title: "Chiếu Tatami Nhập Khẩu Nhật Bản",
    subtitle: "Cỏ Igusa Tự Nhiên • Viền Vải Thô",
    price: 5200000,
    originalPrice: 6000000,
    image: "/images/bedroom-3.jpg",
    category: "Phòng Ngủ",
    material: "Cỏ Igusa Tự Nhiên",
    slug: "chieu-tatami-kyoto",
  },
  "bed-3": {
    id: "bed-3",
    sku: "KL-WAR-SHO",
    title: "Hệ Tủ Áo Shoji Wardrobe",
    subtitle: "Khung Sồi • Giấy Washi Gia Cường & Kính",
    price: 42000000,
    originalPrice: 48000000,
    image: "/images/bedroom-4.jpg",
    category: "Phòng Ngủ",
    material: "Khung Gỗ Sồi",
    slug: "tu-ao-shoji",
  },
  "bed-4": {
    id: "bed-4",
    sku: "KL-FLT-KAW",
    title: "Tủ Đầu Giường Treo Tường Kawa",
    subtitle: "Gỗ Sồi Bắc Mỹ • Ngăn Kéo Khớp Mộng",
    price: 4800000,
    originalPrice: 5500000,
    image: "/images/bedroom-5.jpg",
    category: "Phòng Ngủ",
    material: "Gỗ Sồi Bắc Mỹ",
    slug: "tu-dau-giuong-kawa",
  },
};

const initialWishlist: WishlistItem[] = [
  masterCatalog["p1"],
  masterCatalog["p3"],
  masterCatalog["living-1"],
];

const initialCart: CartItem[] = [
  {
    id: "item-kura-1",
    sku: "KL-LOU-01",
    title: "Ghế Thư Giãn Gỗ Sồi Kura Lounge Chair",
    subtitle: "Vật liệu: Gỗ sồi tự nhiên Nhật Bản, Da bò sáp Ý Cognac",
    price: 14800000,
    originalPrice: 16500000,
    image: "/images/cart-kura-chair.jpg",
    quantity: 1,
    options: {
      wood: "Gỗ sồi tự nhiên Nhật Bản",
      upholstery: "Da bò sáp Ý Cognac",
      size: "D840 x R760 x C780 mm (Chuẩn công thái học)",
      notes: "Bảo hành mộc 10 năm kết cấu mộng âm dương",
    },
  },
  {
    id: "item-mori-2",
    sku: "KL-TAB-18",
    title: "Bàn Ăn Mori Oak Table",
    subtitle: "Vật liệu: Gỗ Sồi Trắng Bắc Mỹ (FSC® 100%), Dầu khoáng tự nhiên",
    price: 24500000,
    originalPrice: 26800000,
    image: "/images/cart-mori-table.jpg",
    quantity: 1,
    options: {
      wood: "Gỗ Sồi Trắng Bắc Mỹ (FSC® 100%)",
      size: "Mặt bàn nguyên tấm rộng 1.8m x D900 x C750 mm",
      notes: "Sức chứa: 6 - 8 ghế đồng bộ phong cách Wabi-sabi",
    },
  },
];

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discountCode: string;
  discountPercent: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;
  wishlist: WishlistItem[];
  toggleWishlist: (itemOrId: WishlistItem | string) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isWishlisted: (id: string) => boolean;
  wishlistCount: number;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  setIsWishlistOpen: (open: boolean) => void;
  moveAllWishlistToCart: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(initialCart);
  const [discountCode, setDiscountCode] = useState<string>("KOMO-MONO10");
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Client-side hydration from localStorage if available
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("komorebi_wishlist");
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored as array of strings, map back to items
          const normalized = parsed
            .map((item: string | WishlistItem) => {
              if (typeof item === "string") {
                return masterCatalog[item];
              }
              return item;
            })
            .filter(Boolean);
          if (normalized.length > 0) {
            setWishlist(normalized);
          }
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const addToCart = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qty = newItem.quantity || 1;
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.sku === newItem.sku &&
          i.options?.wood === newItem.options?.wood &&
          i.options?.upholstery === newItem.options?.upholstery
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          ...newItem,
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          quantity: qty,
        },
      ];
    });
    showToast(`Đã thêm "${newItem.title}" vào giỏ hàng.`);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        showToast(`Đã xóa "${target.title}" khỏi giỏ hàng.`);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyDiscount = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "KOMO-MONO10" || trimmed === "KOMOREBI10" || trimmed === "ARCHITECT10") {
      setDiscountCode(trimmed);
      setDiscountPercent(10);
      showToast("Áp dụng mã ưu đãi 10% thành công!");
      return { success: true, message: "Đã áp dụng mã giảm giá 10%!" };
    } else if (trimmed === "KOMO15" || trimmed === "AUTUMN15") {
      setDiscountCode(trimmed);
      setDiscountPercent(15);
      showToast("Áp dụng mã đặc quyền 15% thành công!");
      return { success: true, message: "Đã áp dụng mã đặc quyền 15%!" };
    } else {
      return { success: false, message: "Mã giảm giá không hợp lệ hoặc đã hết hạn." };
    }
  };

  const removeDiscount = () => {
    setDiscountCode("");
    setDiscountPercent(0);
    showToast("Đã hủy áp dụng mã giảm giá.");
  };

  // Wishlist actions
  const isWishlisted = (id: string) => {
    return wishlist.some(
      (item) => item.id === id || item.slug === id || item.sku === id
    );
  };

  const toggleWishlist = (itemOrId: WishlistItem | string) => {
    let targetItem: WishlistItem | undefined;

    if (typeof itemOrId === "string") {
      targetItem = masterCatalog[itemOrId] || wishlist.find(
        (w) => w.id === itemOrId || w.slug === itemOrId || w.sku === itemOrId
      );
      if (!targetItem) {
        // Fallback item
        targetItem = {
          id: itemOrId,
          sku: `KL-${itemOrId.toUpperCase()}`,
          title: "Tác Phẩm Nội Thất Komorebi",
          subtitle: "Gỗ Mộc Thủ Công • Chuẩn FSC®",
          price: 14800000,
          image: "/images/product-kura-chair.jpg",
          slug: "kura-lounge-chair",
        };
      }
    } else {
      targetItem = itemOrId;
    }

    setWishlist((prev) => {
      const exists = prev.some(
        (i) => i.id === targetItem.id || i.slug === targetItem.slug
      );
      let nextList: WishlistItem[];
      if (exists) {
        nextList = prev.filter(
          (i) => i.id !== targetItem.id && i.slug !== targetItem.slug
        );
        showToast(`Đã xóa "${targetItem.title}" khỏi danh sách yêu thích.`);
      } else {
        nextList = [targetItem, ...prev];
        showToast(`Đã lưu "${targetItem.title}" vào danh sách yêu thích.`);
      }

      try {
        localStorage.setItem("komorebi_wishlist", JSON.stringify(nextList));
      } catch {
        // Ignore
      }
      return nextList;
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => {
      const target = prev.find((i) => i.id === id || i.slug === id);
      const nextList = prev.filter((i) => i.id !== id && i.slug !== id);
      if (target) {
        showToast(`Đã xóa "${target.title}" khỏi danh sách yêu thích.`);
      }
      try {
        localStorage.setItem("komorebi_wishlist", JSON.stringify(nextList));
      } catch {
        // Ignore
      }
      return nextList;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    try {
      localStorage.removeItem("komorebi_wishlist");
    } catch {
      // Ignore
    }
    showToast("Đã xóa toàn bộ danh sách yêu thích.");
  };

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  const moveAllWishlistToCart = () => {
    if (wishlist.length === 0) {
      showToast("Danh sách yêu thích đang trống.");
      return;
    }
    wishlist.forEach((item) => {
      addToCart({
        id: item.id,
        sku: item.sku,
        title: item.title,
        subtitle: item.subtitle,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        quantity: 1,
      });
    });
    showToast(`Đã chuyển toàn bộ ${wishlist.length} tác phẩm yêu thích vào giỏ hàng!`);
  };

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal > 20000000 || items.length === 0 ? 0 : 500000;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discountCode,
        discountPercent,
        discountAmount,
        shippingFee,
        total,
        applyDiscount,
        removeDiscount,
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlisted,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
        setIsWishlistOpen,
        moveAllWishlistToCart,
        toast,
        showToast,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-on-primary px-5 py-3.5 shadow-2xl border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span className="text-body-sm font-medium tracking-wide">{toast}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
