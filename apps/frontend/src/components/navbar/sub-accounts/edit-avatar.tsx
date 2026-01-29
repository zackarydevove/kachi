import { AccountForm } from "@/types/account.type";
import { CameraIcon, XIcon } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getAvatarUrl } from "@/utils/avatar.util";
import { cn } from "@/lib/utils";

export default function EditAvatar(props: {
  formData: AccountForm;
  setError: (error: { message: string; path: string } | null) => void;
  editType: boolean;
  loading: boolean;
  handleFormChange: (key: string, value: string) => void;
  setAvatarFile: (file: File | null) => void;
}) {
  const {
    formData,
    setError,
    editType,
    loading,
    handleFormChange,
    setAvatarFile,
  } = props;

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size is <5MB
      if (file.size > 5 * 1024 * 1024) {
        setError({
          message: "File size must be less than 5MB",
          path: "avatar",
        });
        return;
      }

      // Check file type is image
      if (!file.type.startsWith("image/")) {
        setError({
          message: "Please select a valid image file",
          path: "avatar",
        });
        return;
      }

      // Clear any previous errors
      setError(null);

      // Store the file for later upload
      setAvatarFile(file);

      // Convert file to data URL for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleFormChange("avatar", result);
      };
      reader.onerror = () => {
        setError({
          message: "Failed to read file. Please try again.",
          path: "avatar",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Current avatar preview */}
      <div className="relative">
        <Avatar className="h-16 w-16 border-2 border-border">
          <AvatarImage
            src={formData.avatar || getAvatarUrl(formData.avatar) || undefined}
            alt="Avatar preview"
          />
        </Avatar>

        {/* Upload button overlay */}
        <label
          htmlFor="avatar-upload"
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-full bg-black/20  group",
            loading
              ? "cursor-not-pointer"
              : "hover:bg-black/40 transition-colors cursor-pointer",
          )}
        >
          <div
            className={cn(
              "h-8 w-8 rounded-full bg-black/60 flex items-center justify-center text-white",
              loading
                ? "cursor-not-pointer"
                : "cursor-pointer hover:bg-black/80 transition-colors",
            )}
          >
            <CameraIcon className="size-4" />
          </div>
        </label>

        {/* Remove avatar button (only show when editing and has avatar) */}
        {editType && formData.avatar && (
          <Button
            variant="destructive"
            size="icon"
            type="button"
            disabled={loading}
            onClick={() => handleFormChange("avatar", "")}
            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full opacity-90 hover:opacity-100 flex items-center justify-center text-white text-xs transition-colors"
          >
            <XIcon className="size-3" />
          </Button>
        )}
      </div>

      {/* File input (hidden) */}
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={loading}
      />

      {/* Upload info */}
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">
          Click the + button to upload a new avatar
        </p>
        <p className="text-xs text-muted-foreground">
          Supports JPG, PNG, GIF up to 5MB
        </p>
      </div>
    </div>
  );
}
