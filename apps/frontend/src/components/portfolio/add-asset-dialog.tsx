"use client";

import { useState } from "react";
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
import Step1AssetTypeSelection from "./add-asset-steps/step-1-asset-type-selection";
import Step2AssetDetails from "./add-asset-steps/step-2-asset-details";
import {
  AssetType,
  AssetFormData,
  initialFormData,
  assetTypeLabels,
  Asset,
} from "@/types";
import { useAssetStore } from "@/store/asset.store";

export default function AddAssetDialog() {
  const addAsset = useAssetStore((state) => state.addAsset);

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | null>(
    null
  );
  const [formData, setFormData] = useState<AssetFormData[AssetType]>(
    {} as AssetFormData[AssetType]
  );

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedAssetType(null);
    setFormData({} as AssetFormData[AssetType]);
  };

  const handleAssetTypeSelect = (assetType: AssetType) => {
    setSelectedAssetType(assetType);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetForm();
  };

  const handleContinue = () => {
    if (currentStep === 1 && selectedAssetType) {
      setFormData(initialFormData[selectedAssetType]);
      setCurrentStep(2);
    }
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAsset = () => {
    if (selectedAssetType && formData) addAsset(selectedAssetType, formData);
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const canContinue = () => {
    return currentStep === 1 ? selectedAssetType : false;
  };

  const canAdd = () => {
    // TODO: Here validate that fields are valid
    if (currentStep === 2) {
      // const requiredFields = AssetFormData[selectedAssetType].keys;
      // const hasRequiredFields = requiredFields.every((field) = formData[field as keyof AssetFormData]);

      // return hasRequiredFields;
      return true;
    }
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Add Asset</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 1 ? "Select Asset Type" : "Add Asset Details"}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1
              ? "Choose the type of asset you want to add to your portfolio."
              : `Add details for your ${
                  assetTypeLabels[selectedAssetType as AssetType]
                } asset.`}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 1 ? (
          <Step1AssetTypeSelection
            selectedAssetType={selectedAssetType}
            onAssetTypeSelect={handleAssetTypeSelect}
          />
        ) : (
          <div className="pb-2">
            <Step2AssetDetails
              selectedAssetType={selectedAssetType!}
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep === 2 && (
              <Button variant="outline" onClick={resetForm}>
                Back
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DialogClose>
          </div>

          <div className="flex gap-2">
            {currentStep === 1 ? (
              <Button onClick={handleContinue} disabled={!canContinue()}>
                Continue
              </Button>
            ) : (
              <Button onClick={handleAddAsset} disabled={!canAdd()}>
                Add Asset
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
