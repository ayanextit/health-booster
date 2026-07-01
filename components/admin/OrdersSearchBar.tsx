"use client";

import { useRouter } from "next/navigation";
import { useTransition, useRef } from "react";
import { Search, X } from "lucide-react";

export default function OrdersSearchBar({
  defaultValue,
  status,
}: {
  defaultValue: string;
  status: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (value: string) => {
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    if (status) params.set("status", status);
    const qs = params.toString();
    startTransition(() => {
      router.push(`/admin/orders${qs ? `?${qs}` : ""}`);
    });
  };

  return (
    <div className="relative flex-1 max-w-sm">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        defaultValue={defaultValue}
        placeholder="অর্ডার নং, নাম বা ফোন..."
        onKeyDown={(e) => e.key === "Enter" && submit(e.currentTarget.value)}
        className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      {isPending && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      )}
      {!isPending && defaultValue && (
        <button
          onClick={() => {
            if (inputRef.current) inputRef.current.value = "";
            submit("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
