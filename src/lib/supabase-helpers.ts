import { supabase } from "@/integrations/supabase/client";

// Generic fetch helper - uses 'any' to bypass strict Supabase typing for dynamic table access
export async function fetchTable<T>(table: string, options?: { 
  limit?: number; 
  orderBy?: string; 
  ascending?: boolean;
  filters?: Record<string, unknown>;
}) {
  let query = (supabase.from as any)(table).select("*");
  
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }
  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? false });
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as T[];
}

export async function fetchById<T>(table: string, id: string) {
  const { data, error } = await (supabase.from as any)(table).select("*").eq("id", id).single();
  if (error) throw error;
  return data as T;
}
