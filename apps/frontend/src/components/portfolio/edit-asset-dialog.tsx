"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Asset, AssetFormData, assetTypeLabels } from "@/types/asset.type";
import { useState } from "react";
import { useAssetStore } from "@/store/asset.store";
import { Loader2Icon } from "lucide-react";

export default function EditAssetDialog(props: {
  asset: Asset & { value?: number };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const editAsset = useAssetStore((state) => state.editAsset);

  const initialFormData = {
    type: props.asset?.type || null,
    name: props.asset?.name || "",
    value: props.asset?.value || 0,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<AssetFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (props.onOpenChange) {
      props.onOpenChange(open);
    } else {
      setIsOpen(open);
    }
    if (!open) setFormData(initialFormData);
  };

  const handleFormDataChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = async () => {
    try {
      setLoading(true);
      await editAsset(props.asset.id, formData);
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to edit asset:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.name.trim() !== "" && formData.value > 0;
  };

  return (
    <Dialog open={props.open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Asset Details</DialogTitle>
          <DialogDescription>Edit details for your asset.</DialogDescription>
        </DialogHeader>

        {/* Type */}
        <Select
          value={formData.type || ""}
          onValueChange={(value) => handleFormDataChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an asset type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(assetTypeLabels)
              .filter(([key]) => key != "networth")
              .map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="My Asset Name"
            value={formData.name}
            onChange={(e) => handleFormDataChange("name", e.target.value)}
            required
          />
        </div>

        {/* Value */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            type="number"
            placeholder="My Asset Value"
            value={formData.value}
            onChange={(e) =>
              handleFormDataChange("value", Number(e.target.value))
            }
            required
          />
        </div>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleApply} disabled={!isFormValid() || loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : "Edit Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
