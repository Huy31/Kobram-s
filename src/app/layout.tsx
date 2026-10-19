import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import WishlistDrawer from "@/components/WishlistDrawer";
import ChatbotWidget from "@/components/ChatbotWidget";

export const metadata: Metadata = {
  title: "Komorebi Living | Nghệ Thuật Cân Bằng Không Gian Sống",
  description:
    "Thương hiệu nội thất mộc thủ công cao cấp kết hợp triết lý Wabi-Sabi và chuẩn mực Scandinavian. Gỗ sồi & walnut Bắc Mỹ đạt chứng nhận FSC® 100%.",
  keywords: [
    "Nội thất cao cấp",
    "Ghế Kura Lounge Chair",
    "Bàn ăn Mori Oak",
    "Komorebi Living",
    "Wabi-Sabi",
    "Nội thất Scandinavian",
    "Thiết kế nội thất",
  ],
  authors: [{ name: "Komorebi Living Atelier" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,300..900;1,300..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAFAFA] text-[#18181B] antialiased selection:bg-[#09090B] selection:text-white min-h-screen flex flex-col font-body-md text-body-md">
        <LanguageProvider>
          <CartProvider>
            {children}
            <WishlistDrawer />
            <ChatbotWidget />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
