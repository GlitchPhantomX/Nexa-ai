"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";

export const useMeetingsFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const agentId = searchParams.get("agentId") ?? "";
  const page = Number(searchParams.get("page") ?? DEFAULT_PAGE);
  const pageSize = Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE);

  const setFilter = useCallback(
    (updates: { search?: string; status?: string; agentId?: string; page?: number; pageSize?: number }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.search !== undefined) {
        updates.search ? params.set("search", updates.search) : params.delete("search");
      }
      if (updates.status !== undefined) {
        updates.status ? params.set("status", updates.status) : params.delete("status");
      }
      if (updates.agentId !== undefined) {
        updates.agentId ? params.set("agentId", updates.agentId) : params.delete("agentId");
      }
      if (updates.page !== undefined) {
        updates.page === DEFAULT_PAGE ? params.delete("page") : params.set("page", String(updates.page));
      }
      if (updates.pageSize !== undefined) {
        updates.pageSize === DEFAULT_PAGE_SIZE ? params.delete("pageSize") : params.set("pageSize", String(updates.pageSize));
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return [{ search, status, agentId, page, pageSize }, setFilter] as const;
};
