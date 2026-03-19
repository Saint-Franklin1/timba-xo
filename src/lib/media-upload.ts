import imageCompression from "browser-image-compression";
import { supabase } from "@/integrations/supabase/client";

export type MediaCategory =
  | "drink"
  | "event_poster"
  | "event_gallery"
  | "event_video"
  | "dining_dish"
  | "venue_section"
  | "hero_banner"
  | "award"
  | "partner";

const CATEGORY_BUCKET_MAP: Record<MediaCategory, string> = {
  drink: "drinks_images",
  event_poster: "event_posters",
  event_gallery: "event_gallery",
  event_video: "event_videos",
  dining_dish: "dining_images",
  venue_section: "venue_images",
  hero_banner: "hero_banners",
  award: "awards_images",
  partner: "partner_logos",
};

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const CATEGORY_MAX_IMAGES: Partial<Record<MediaCategory, number>> = {
  drink: 3,
  dining_dish: 3,
  venue_section: 4,
};

async function convertToWebP(file: File): Promise<File> {
  if (file.type.startsWith("video/")) return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) { reject(new Error("WebP conversion failed")); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" }));
        },
        "image/webp",
        0.85
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

async function compressImage(file: File): Promise<File> {
  if (file.type.startsWith("video/")) return file;

  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp" as const,
  };

  try {
    const compressed = await imageCompression(file, options);
    return new File([compressed], file.name, { type: compressed.type });
  } catch {
    return file;
  }
}

export async function checkCategoryLimit(
  category: MediaCategory,
  linkedId?: string
): Promise<{ allowed: boolean; current: number; max: number | null }> {
  const max = CATEGORY_MAX_IMAGES[category] ?? null;
  if (!max || !linkedId) return { allowed: true, current: 0, max };

  const { count } = await (supabase.from as any)("media_assets")
    .select("*", { count: "exact", head: true })
    .eq("category", category)
    .eq("description", linkedId)
    .eq("is_hidden", false);

  return { allowed: (count ?? 0) < max, current: count ?? 0, max };
}

export async function uploadMedia(
  file: File,
  category: MediaCategory,
  metadata?: {
    title?: string;
    description?: string;
    is_featured?: boolean;
  }
): Promise<{ id: string; url: string } | null> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
  }

  const bucket = CATEGORY_BUCKET_MAP[category];
  const isVideo = file.type.startsWith("video/");

  // Process image: compress and convert to WebP
  let processedFile = file;
  if (!isVideo) {
    processedFile = await convertToWebP(file);
    processedFile = await compressImage(processedFile);
  }

  // Generate unique path
  const ext = isVideo ? file.name.split(".").pop() : "webp";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, processedFile, {
      contentType: processedFile.type,
      cacheControl: "3600",
    });

  if (uploadError) throw uploadError;

  // Get public URL (buckets are now public)
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
  const finalUrl = urlData.publicUrl;

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Store metadata in database
  const { data: mediaRecord, error: dbError } = await (supabase.from as any)("media_assets")
    .insert({
      category,
      title: metadata?.title || file.name,
      description: metadata?.description || "",
      image_url: isVideo ? null : finalUrl,
      video_url: isVideo ? finalUrl : null,
      storage_bucket: bucket,
      storage_path: path,
      file_size: processedFile.size,
      file_format: isVideo ? file.type : "image/webp",
      is_featured: metadata?.is_featured || false,
      is_hidden: false,
      uploaded_by: user?.id,
    })
    .select("id")
    .single();

  if (dbError) throw dbError;

  return { id: mediaRecord.id, url: finalUrl };
}

export async function deleteMedia(id: string): Promise<void> {
  // Get media record first
  const { data: media, error: fetchError } = await (supabase.from as any)("media_assets")
    .select("storage_bucket, storage_path")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // Delete from storage
  if (media?.storage_path) {
    await supabase.storage.from(media.storage_bucket).remove([media.storage_path]);
  }

  // Delete from database
  const { error } = await (supabase.from as any)("media_assets").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleFeatured(id: string, featured: boolean): Promise<void> {
  const { error } = await (supabase.from as any)("media_assets")
    .update({ is_featured: featured })
    .eq("id", id);
  if (error) throw error;
}

export async function toggleHidden(id: string, hidden: boolean): Promise<void> {
  const { error } = await (supabase.from as any)("media_assets")
    .update({ is_hidden: hidden })
    .eq("id", id);
  if (error) throw error;
}

export async function updateMediaMetadata(
  id: string,
  data: { title?: string; description?: string }
): Promise<void> {
  const { error } = await (supabase.from as any)("media_assets")
    .update(data)
    .eq("id", id);
  if (error) throw error;
}

export async function fetchMediaByCategory(category: MediaCategory) {
  const { data, error } = await (supabase.from as any)("media_assets")
    .select("*")
    .eq("category", category)
    .eq("is_hidden", false)
    .order("uploaded_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchFeaturedMedia(category: MediaCategory) {
  const { data, error } = await (supabase.from as any)("media_assets")
    .select("*")
    .eq("category", category)
    .eq("is_featured", true)
    .eq("is_hidden", false)
    .order("uploaded_at", { ascending: false });

  if (error) throw error;
  return data;
}

export { CATEGORY_BUCKET_MAP };
