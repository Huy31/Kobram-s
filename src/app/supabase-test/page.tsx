import React, { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function SupabaseDataContent() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Truy vấn thử bảng products hoặc todos từ Supabase
  const { data: products, error: prodError } = await supabase.from("products").select().limit(10);
  const { data: todos } = await supabase.from("todos").select();

  return (
    <div>
      {prodError ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 mb-6 text-sm">
          <p className="font-semibold">Chưa tìm thấy bảng dữ liệu trên Supabase:</p>
          <p className="font-mono mt-1 text-xs">{prodError.message}</p>
          <p className="mt-2 text-xs">
            👉 Hãy mở Supabase Dashboard &gt; SQL Editor và chạy nội dung file <code>database/schema.sql</code>.
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-green-700 mb-3">
            ✓ Kết nối Supabase thành công! Dữ liệu bảng <code>products</code>:
          </h2>
          <ul className="space-y-2">
            {products?.map((item: any) => (
              <li key={item.id} className="p-3 bg-white border border-gray-200 rounded-lg flex justify-between">
                <span className="font-medium text-gray-900">{item.title}</span>
                <span className="text-gray-600 font-mono text-sm">{Number(item.price).toLocaleString("vi-VN")} đ</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {todos && todos.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-3">Danh sách Todos:</h2>
          <ul className="list-disc pl-5 space-y-1">
            {todos.map((todo: any) => (
              <li key={todo.id}>{todo.name || todo.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SupabaseTestPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6 font-sans">
      <h1 className="text-2xl font-bold mb-2">Trang Kiểm Tra Kết Nối Supabase</h1>
      <p className="text-sm text-gray-500 mb-6">
        Route: <code>/supabase-test</code>
      </p>

      <Suspense fallback={<div className="p-6 bg-gray-50 rounded-lg animate-pulse text-gray-500">Đang tải dữ liệu từ Supabase...</div>}>
        <SupabaseDataContent />
      </Suspense>
    </main>
  );
}
