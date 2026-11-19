import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ngnFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null | undefined): string {
  const num = Number(amount ?? 0);
  if (Number.isNaN(num)) {
    return "₦0";
  }
  return ngnFormatter.format(num);
}

export function formatBytes(bytes: number | string | null | undefined): string {
  const b = Number(bytes ?? 0);
  if (!b || b <= 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  const value = b / Math.pow(k, i);
  return `${value.toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`;
}

export function formatStorageGB(gb: number | string | null | undefined, bytes?: number): string {
  if (typeof bytes === "number" && bytes > 0 && bytes < 1024 * 1024 * 100) {
    return formatBytes(bytes);
  }
  const num = Number(gb ?? 0);
  if (num >= 1000) {
    return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)} TB`;
  }
  if (num > 0 && num < 0.01) {
    return "< 0.01 GB";
  }
  return `${Number(num.toFixed(2))} GB`;
}
