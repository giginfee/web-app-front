import type { ApiError, IsLoading } from "~/types";
import { useFetch } from "#app";

export function isLoading(data: IsLoading | any): data is IsLoading {
  return "isLoading" in data;
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function fetchWithAuth(url: string, token: string, options = {}) {
  return useFetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
