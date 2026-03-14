import { useMediaByCategory, useFeaturedMedia } from "@/hooks/use-media";
import type { MediaCategory } from "@/lib/media-upload";

interface MediaGalleryProps {
  category: MediaCategory;
  featuredOnly?: boolean;
  maxItems?: number;
  className?: string;
  aspectRatio?: "square" | "video" | "banner";
}

export function MediaGallery({
  category,
  featuredOnly = false,
  maxItems,
  className = "",
  aspectRatio = "square",
}: MediaGalleryProps) {
  const { data: items = [] } = featuredOnly
    ? useFeaturedMedia(category)
    : useMediaByCategory(category);

  const displayed = maxItems ? items.slice(0, maxItems) : items;

  if (!displayed.length) return null;

  const aspectClass =
    aspectRatio === "banner"
      ? "aspect-[16/9]"
      : aspectRatio === "video"
      ? "aspect-video"
      : "aspect-square";

  return (
    <div className={`grid gap-3 ${className}`}>
      {displayed.map((item: Record<string, unknown>) => {
        const url = (item.image_url || item.video_url) as string;
        const isVideo = item.category === "event_video";

        return (
          <div key={item.id as string} className={`${aspectClass} rounded-lg overflow-hidden bg-secondary`}>
            {isVideo ? (
              <video src={url} controls className="w-full h-full object-cover" />
            ) : url ? (
              <img
                src={url}
                alt={(item.title as string) || ""}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function FeaturedImage({
  category,
  className = "",
  fallback,
}: {
  category: MediaCategory;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const { data: items = [] } = useFeaturedMedia(category);
  const featured = items[0] as Record<string, unknown> | undefined;
  const url = featured ? ((featured.image_url || featured.video_url) as string) : null;

  if (!url) return <>{fallback}</> || null;

  return <img src={url} alt={(featured?.title as string) || ""} className={className} loading="lazy" />;
}
