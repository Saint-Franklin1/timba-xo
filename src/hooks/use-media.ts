import { useQuery } from "@tanstack/react-query";
import { fetchMediaByCategory, fetchFeaturedMedia, type MediaCategory } from "@/lib/media-upload";

export function useMediaByCategory(category: MediaCategory) {
  return useQuery({
    queryKey: ["media_assets", category, "public"],
    queryFn: () => fetchMediaByCategory(category),
  });
}

export function useFeaturedMedia(category: MediaCategory) {
  return useQuery({
    queryKey: ["media_assets", category, "featured"],
    queryFn: () => fetchFeaturedMedia(category),
  });
}
