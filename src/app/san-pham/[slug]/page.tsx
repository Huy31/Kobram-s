import React, { Suspense } from "react";
import ProductDetailPage from "../kura-lounge-chair/page";

export function generateStaticParams() {
  return [
    { slug: "kura-lounge-chair" },
    { slug: "nordic-cloud-sofa" },
    { slug: "mori-oak-table" },
    { slug: "wabi-paper-lamp" },
    { slug: "kanso-coffee-table" },
    { slug: "zen-platform-bed" },
    { slug: "sofa-go-soi-nami" },
    { slug: "ban-tra-tron-enso" },
    { slug: "ke-tivi-kawa" },
    { slug: "tatami-reading-pouf" },
    { slug: "tu-ke-sach-sora" },
    { slug: "ghe-an-kanso" },
    { slug: "ban-an-tron-enso" },
    { slug: "ghe-bang-go-soi" },
    { slug: "tu-chen-mizu" },
    { slug: "xe-day-bar-cart" },
    { slug: "chieu-tatami-kyoto" },
    { slug: "tu-ao-shoji" },
    { slug: "tu-dau-giuong-kawa" },
    { slug: "ban-trang-diem-kanso" },
    { slug: "ghe-bang-duoi-giuong" },
    { slug: "sofa-goc-ni-chu-l-cao-cap" },
  ];
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  return <ProductDetailPage />;
}

export default function GenericProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
      <ProductContent params={props.params} />
    </Suspense>
  );
}
