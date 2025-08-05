"use client";

import React, { useState } from "react";
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
} from "./add-asset-steps/types";

// TODO: The states shouldn't be on the /portfolio page but only inside the dialog only IF its opened
export default function AddAssetDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | "">(
    ""
  );
  const [formData, setFormData] = useState<AssetFormData>(initialFormData);

  const handleAssetTypeSelect = (value: AssetType) => {
    setSelectedAssetType(value);
  };

  const handleFormDataChange = (field: string, value: string) => {
    if (!selectedAssetType) return;

    setFormData((prev) => ({
      ...prev,
      [selectedAssetType]: {
        ...prev[selectedAssetType],
        [field]: value,
      },
    }));
  };

  const handleContinue = () => {
    if (currentStep === 1 && selectedAssetType) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      resetForm();
    }
  };

  const handleAdd = async () => {
    // TODO: Implement API call to add asset
    console.log("Adding asset:", { type: selectedAssetType, ...formData });
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedAssetType("");
    setFormData(initialFormData);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const canContinue = () => {
    return currentStep === 1 ? selectedAssetType !== "" : false;
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              : `Add details for your ${assetTypeLabels[selectedAssetType]} asset.`}
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
              selectedAssetType={selectedAssetType as AssetType}
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep === 2 && (
              <Button variant="outline" onClick={handleBack}>
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
              <Button onClick={handleAdd} disabled={!canAdd()}>
                Add Asset
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
