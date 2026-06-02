import { normalizeSupabaseUrl } from "@/lib/supabase/env";

export function publicStorageUrl(path: string) {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return "";
  const base = normalizeSupabaseUrl(raw);
  const clean = path.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/product-images/${clean}`;
}
