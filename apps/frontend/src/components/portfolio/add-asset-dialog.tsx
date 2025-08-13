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
  DialogTrigger,
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
import { AssetFormData, assetTypeLabels } from "@/types/asset.type";
import { useState } from "react";
import { useAssetStore } from "@/store/asset.store";

export default function AddAssetDialog() {
  const addAsset = useAssetStore((state) => state.addAsset);

  const initialFormData = {
    type: null,
    name: "",
    value: 0,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<AssetFormData>(initialFormData);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setFormData(initialFormData);
  };

  const handleFormDataChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAsset = () => {
    addAsset(formData);
    handleOpenChange(false);
  };

  const isFormValid = () => {
    return formData.type && formData.name.trim() !== "" && formData.value > 0;
  };

  // Add mode - show with trigger
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Asset</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Asset Details</DialogTitle>
          <DialogDescription>Add details for your new asset.</DialogDescription>
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
            {Object.keys(assetTypeLabels).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
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
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleAddAsset} disabled={!isFormValid()}>
            Add Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
