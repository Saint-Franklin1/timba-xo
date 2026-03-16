import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Star, Loader2, ImageIcon, Film } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

interface UploadedFile {
  url: string;
  path: string;
  isHD: boolean;
  type: "image" | "video";
}

interface ImageUploaderProps {
  bucket: string;
  existingFiles?: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  maxImages?: number;
  maxImageSizeMB?: number;
  maxVideoSizeMB?: number;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

async function convertToWebP(file: File): Promise<File> {
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

async function compressImage(file: File, isHD: boolean): Promise<File> {
  const options = {
    maxSizeMB: isHD ? 3 : 1.5,
    maxWidthOrHeight: isHD ? 3840 : 1920,
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

export default function ImageUploader({
  bucket,
  existingFiles = [],
  onChange,
  maxImages = MAX_IMAGES,
}: ImageUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const imageCount = files.filter(f => f.type === "image").length;
  const hasHD = files.some(f => f.isHD);

  const handleUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    const newFiles: UploadedFile[] = [...files];

    for (const file of Array.from(selectedFiles)) {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      if (!isImage && !isVideo) {
        toast.error(`${file.name}: Only images and videos are allowed`);
        continue;
      }

      if (isImage && file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name}: Image must be under 4MB`);
        continue;
      }

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        toast.error(`${file.name}: Video must be under 10MB`);
        continue;
      }

      const currentImages = newFiles.filter(f => f.type === "image").length;
      if (isImage && currentImages >= maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        continue;
      }

      try {
        let processedFile = file;
        if (isImage) {
          processedFile = await convertToWebP(file);
          processedFile = await compressImage(processedFile, false);
        }

        const ext = isVideo ? file.name.split(".").pop() : "webp";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, processedFile, {
            contentType: processedFile.type,
            cacheControl: "3600",
          });

        if (uploadError) throw uploadError;

        const { data: signedData } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 60 * 60 * 24 * 365);

        const url = signedData?.signedUrl || "";

        newFiles.push({
          url,
          path,
          isHD: false,
          type: isVideo ? "video" : "image",
        });
      } catch (err: any) {
        toast.error(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    setFiles(newFiles);
    onChange(newFiles);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = async (index: number) => {
    const file = files[index];
    try {
      await supabase.storage.from(bucket).remove([file.path]);
    } catch {}
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange(updated);
  };

  const toggleHD = (index: number) => {
    const updated = files.map((f, i) => {
      if (i === index) return { ...f, isHD: !f.isHD };
      if (f.isHD && f.type === "image") return { ...f, isHD: false };
      return f;
    });
    setFiles(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Images: {imageCount}/{maxImages} • Videos allowed • {hasHD ? "1 HD set" : "No HD set"}
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          Upload
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-secondary">
              {file.type === "video" ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="h-8 w-8 text-muted-foreground" />
                </div>
              ) : (
                <img src={file.url} alt="" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {file.type === "image" && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={`h-7 w-7 ${file.isHD ? "text-yellow-400" : "text-white"}`}
                    onClick={() => toggleHD(i)}
                    title="Set as HD"
                  >
                    <Star className="h-3.5 w-3.5" fill={file.isHD ? "currentColor" : "none"} />
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive"
                  onClick={() => handleRemove(i)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              {file.isHD && (
                <Badge className="absolute top-1 left-1 text-[10px] px-1 py-0 bg-yellow-500/90 text-black">HD</Badge>
              )}
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <div
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Click to upload images or videos</p>
          <p className="text-[10px] text-muted-foreground mt-1">Max 4MB/image, 10MB/video • Up to {maxImages} images</p>
        </div>
      )}
    </div>
  );
}
