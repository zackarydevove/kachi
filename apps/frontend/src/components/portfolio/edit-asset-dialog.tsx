import { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogContent,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AssetType, AssetFormData } from "@/types/asset.type";
import Step2AssetDetails from "./add-asset-steps/step-2-asset-details";

interface EditAssetDialogProps<T extends AssetType> {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  assetType: T;
  initialFormData: AssetFormData[T];
  onSave: (data: AssetFormData[T]) => void;
}

export default function EditAssetDialog<T extends AssetType>({
  open,
  setOpen,
  assetType,
  initialFormData,
  onSave,
}: EditAssetDialogProps<T>) {
  console.log("initialFormData dans EditAssetDialog: ", initialFormData);
  const [formData, setFormData] = useState<AssetFormData[T]>(initialFormData);
  console.log("formData dans EditAssetDialog: ", formData);

  // Update formData when initialFormData changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleFormDataChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit asset</DialogTitle>
          <DialogDescription>Edit details for your asset.</DialogDescription>
        </DialogHeader>
        <Step2AssetDetails
          selectedAssetType={assetType}
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
