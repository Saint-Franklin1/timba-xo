import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  uploadMedia,
  deleteMedia,
  toggleFeatured,
  toggleHidden,
  updateMediaMetadata,
  type MediaCategory,
} from "@/lib/media-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Trash2, Star, EyeOff, Eye, Image as ImageIcon, Video, Edit, X } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES: { value: MediaCategory; label: string }[] = [
  { value: "drink", label: "Drinks" },
  { value: "event_poster", label: "Event Posters" },
  { value: "event_gallery", label: "Event Gallery" },
  { value: "event_video", label: "Event Videos" },
  { value: "dining_dish", label: "Dining" },
  { value: "venue_section", label: "Venue" },
  { value: "hero_banner", label: "Hero Banners" },
  { value: "award", label: "Awards" },
  { value: "partner", label: "Partner Logos" },
];

// Category-specific metadata fields
const CATEGORY_FIELDS: Record<MediaCategory, { key: string; label: string; type?: string }[]> = {
  drink: [
    { key: "drink_name", label: "Drink Name" },
    { key: "brand", label: "Brand" },
    { key: "type", label: "Type" },
    { key: "color", label: "Color" },
    { key: "taste_notes", label: "Tasting Notes", type: "textarea" },
    { key: "year_manufactured", label: "Year", type: "number" },
    { key: "origin_country", label: "Origin Country" },
    { key: "alcohol_content", label: "Alcohol %", type: "number" },
    { key: "bottle_size", label: "Bottle Size" },
    { key: "price", label: "Price (KES)", type: "number" },
    { key: "provenance_description", label: "Provenance", type: "textarea" },
  ],
  event_poster: [
    { key: "event_name", label: "Event Name" },
    { key: "event_date", label: "Event Date", type: "date" },
    { key: "venue_section", label: "Venue Section" },
  ],
  event_gallery: [
    { key: "event_name", label: "Event Name" },
    { key: "event_date", label: "Event Date", type: "date" },
  ],
  event_video: [
    { key: "event_name", label: "Event Name" },
    { key: "event_date", label: "Event Date", type: "date" },
  ],
  dining_dish: [
    { key: "dish_name", label: "Dish Name" },
    { key: "chef", label: "Chef" },
    { key: "cuisine_type", label: "Cuisine Type" },
    { key: "ingredients", label: "Ingredients", type: "textarea" },
    { key: "price", label: "Price (KES)", type: "number" },
  ],
  venue_section: [
    { key: "venue_section_name", label: "Section Name" },
    { key: "capacity", label: "Capacity", type: "number" },
  ],
  hero_banner: [],
  award: [
    { key: "award_name", label: "Award Name" },
    { key: "organization", label: "Organization" },
    { key: "year", label: "Year", type: "number" },
  ],
  partner: [
    { key: "partner_name", label: "Partner Name" },
    { key: "website", label: "Website URL" },
  ],
};

function DropZone({
  onFiles,
  accept,
  uploading,
}: {
  onFiles: (files: File[]) => void;
  accept?: string;
  uploading: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFiles(files);
    },
    [onFiles]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
        dragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
      } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.accept = accept || "image/*,video/*";
        input.onchange = () => {
          if (input.files) onFiles(Array.from(input.files));
        };
        input.click();
      }}
    >
      <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground">
        {uploading ? "Uploading..." : "Drag & drop files here, or click to select"}
      </p>
      <p className="text-xs text-muted-foreground/60 mt-1">Max 8MB • Images auto-converted to WebP</p>
    </div>
  );
}

function MediaCard({
  item,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleHidden,
}: {
  item: Record<string, unknown>;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onToggleHidden: () => void;
}) {
  const isVideo = item.category === "event_video";
  const url = (item.image_url || item.video_url) as string;
  const isHidden = item.is_hidden as boolean;
  const isFeatured = item.is_featured as boolean;

  return (
    <Card className={`group relative overflow-hidden bg-card border-border ${isHidden ? "opacity-50" : ""}`}>
      <div className="aspect-square relative bg-secondary">
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="h-12 w-12 text-muted-foreground" />
          </div>
        ) : url ? (
          <img src={url} alt={item.title as string} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="icon" variant="ghost" className="h-9 w-9 text-foreground" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`h-9 w-9 ${isFeatured ? "text-primary" : "text-muted-foreground"}`}
            onClick={onToggleFeatured}
            title={isFeatured ? "Unfeature" : "Feature"}
          >
            <Star className="h-4 w-4" fill={isFeatured ? "currentColor" : "none"} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-muted-foreground"
            onClick={onToggleHidden}
            title={isHidden ? "Show" : "Hide"}
          >
            {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <Button size="icon" variant="ghost" className="h-9 w-9 text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isFeatured && (
            <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
              Featured
            </span>
          )}
          {isHidden && (
            <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
              Hidden
            </span>
          )}
        </div>
      </div>
      <CardContent className="p-3">
        <p className="text-sm font-medium text-foreground truncate">{item.title as string || "Untitled"}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {item.file_format as string} • {((item.file_size as number) / 1024).toFixed(0)}KB
        </p>
      </CardContent>
    </Card>
  );
}

export default function MediaManager() {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<MediaCategory>("drink");
  const [uploading, setUploading] = useState(false);
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [uploadMeta, setUploadMeta] = useState<Record<string, string>>({});
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  // Fetch media for active category
  const { data: mediaItems = [] } = useQuery({
    queryKey: ["media_assets", activeCategory],
    queryFn: async () => {
      const { data, error } = await (supabase.from as any)("media_assets")
        .select("*")
        .eq("category", activeCategory)
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data as Record<string, unknown>[];
    },
  });

  const handleFilesSelected = (files: File[]) => {
    // Validate file sizes
    const oversized = files.filter((f) => f.size > 8 * 1024 * 1024);
    if (oversized.length) {
      toast.error(`${oversized.length} file(s) exceed 8MB limit`);
      return;
    }
    setPendingFiles(files);
    setUploadMeta({});
    setShowUploadDialog(true);
  };

  const handleUpload = async () => {
    if (!pendingFiles.length) return;
    setUploading(true);
    try {
      for (const file of pendingFiles) {
        await uploadMedia(file, activeCategory, {
          title: uploadMeta.title || file.name,
          description: JSON.stringify(uploadMeta),
          is_featured: uploadMeta.is_featured === "true",
        });
      }
      toast.success(`${pendingFiles.length} file(s) uploaded successfully`);
      queryClient.invalidateQueries({ queryKey: ["media_assets", activeCategory] });
      setShowUploadDialog(false);
      setPendingFiles([]);
    } catch (e: any) {
      toast.error(`Upload failed: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedia(id);
      toast.success("Media deleted");
      queryClient.invalidateQueries({ queryKey: ["media_assets", activeCategory] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await toggleFeatured(id, !current);
      queryClient.invalidateQueries({ queryKey: ["media_assets", activeCategory] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleToggleHidden = async (id: string, current: boolean) => {
    try {
      await toggleHidden(id, !current);
      queryClient.invalidateQueries({ queryKey: ["media_assets", activeCategory] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleUpdateMeta = async () => {
    if (!editItem) return;
    try {
      await updateMediaMetadata(editItem.id as string, {
        title: editItem.title as string,
        description: editItem.description as string,
      });
      toast.success("Updated");
      queryClient.invalidateQueries({ queryKey: ["media_assets", activeCategory] });
      setEditItem(null);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const categoryFields = CATEGORY_FIELDS[activeCategory] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Media Manager</h2>
        <p className="text-sm text-muted-foreground">{mediaItems.length} assets</p>
      </div>

      {/* Category tabs */}
      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as MediaCategory)}>
        <TabsList className="bg-card border border-border w-full flex flex-wrap h-auto gap-1 p-1">
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c.value} value={c.value} className="text-xs">
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((c) => (
          <TabsContent key={c.value} value={c.value} className="mt-4 space-y-4">
            {/* Drop zone */}
            <DropZone
              onFiles={handleFilesSelected}
              accept={c.value === "event_video" ? "video/*" : "image/*"}
              uploading={uploading}
            />

            {/* Media grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {mediaItems.map((item) => (
                <MediaCard
                  key={item.id as string}
                  item={item}
                  onEdit={() => setEditItem({ ...item })}
                  onDelete={() => handleDelete(item.id as string)}
                  onToggleFeatured={() => handleToggleFeatured(item.id as string, item.is_featured as boolean)}
                  onToggleHidden={() => handleToggleHidden(item.id as string, item.is_hidden as boolean)}
                />
              ))}
            </div>

            {mediaItems.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No media uploaded in this category</p>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Upload Dialog with Metadata */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="bg-card border-border max-h-[85vh] overflow-y-auto max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              Upload {CATEGORIES.find((c) => c.value === activeCategory)?.label}
            </DialogTitle>
          </DialogHeader>

          {/* File previews */}
          <div className="flex gap-2 flex-wrap">
            {pendingFiles.map((f, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary">
                {f.type.startsWith("image/") ? (
                  <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <button
                  className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5"
                  onClick={() => setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Common fields */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={uploadMeta.title || ""}
                onChange={(e) => setUploadMeta({ ...uploadMeta, title: e.target.value })}
                className="bg-secondary border-border"
                placeholder="Asset title"
              />
            </div>

            {/* Category-specific fields */}
            {categoryFields.map((field) => (
              <div key={field.key}>
                <Label className="text-xs">{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={uploadMeta[field.key] || ""}
                    onChange={(e) => setUploadMeta({ ...uploadMeta, [field.key]: e.target.value })}
                    className="bg-secondary border-border"
                  />
                ) : field.type === "date" ? (
                  <Input
                    type="datetime-local"
                    value={uploadMeta[field.key] || ""}
                    onChange={(e) => setUploadMeta({ ...uploadMeta, [field.key]: e.target.value })}
                    className="bg-secondary border-border"
                  />
                ) : field.type === "number" ? (
                  <Input
                    type="number"
                    value={uploadMeta[field.key] || ""}
                    onChange={(e) => setUploadMeta({ ...uploadMeta, [field.key]: e.target.value })}
                    className="bg-secondary border-border"
                  />
                ) : (
                  <Input
                    value={uploadMeta[field.key] || ""}
                    onChange={(e) => setUploadMeta({ ...uploadMeta, [field.key]: e.target.value })}
                    className="bg-secondary border-border"
                  />
                )}
              </div>
            ))}

            {/* Featured toggle */}
            <div className="flex items-center gap-3">
              <Switch
                checked={uploadMeta.is_featured === "true"}
                onCheckedChange={(v) => setUploadMeta({ ...uploadMeta, is_featured: String(v) })}
              />
              <Label className="text-sm">Mark as Featured</Label>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 mt-2"
            onClick={handleUpload}
            disabled={uploading || !pendingFiles.length}
          >
            {uploading ? "Processing & Uploading..." : `Upload ${pendingFiles.length} file(s)`}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={(editItem?.title as string) || ""}
                onChange={(e) => setEditItem({ ...editItem!, title: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <Label className="text-xs">Description / Metadata</Label>
              <Textarea
                value={(editItem?.description as string) || ""}
                onChange={(e) => setEditItem({ ...editItem!, description: e.target.value })}
                className="bg-secondary border-border"
                rows={4}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={editItem?.is_featured as boolean}
                onCheckedChange={(v) => setEditItem({ ...editItem!, is_featured: v })}
              />
              <Label className="text-sm">Featured</Label>
            </div>
            <Button className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90" onClick={handleUpdateMeta}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
