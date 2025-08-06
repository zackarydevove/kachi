"use client";

import React from "react";
import { AssetFormData, AssetType } from "@/types/asset.type";
import CryptoAssetForm from "./crypto-asset-form";
import RealEstateAssetForm from "./real-estate-asset-form";
import StockAssetForm from "./stock-asset-form";
import CashAssetForm from "./cash-asset-form";
import ExoticAssetForm from "./exotic-asset-form";

interface Step2Props<T extends AssetType> {
  selectedAssetType: T;
  formData: AssetFormData[T];
  onFormDataChange: (field: string, value: string) => void;
}

export default function Step2AssetDetails<T extends AssetType>({
  selectedAssetType,
  formData,
  onFormDataChange,
}: Step2Props<T>) {
  const renderAssetTypeForm = () => {
    switch (selectedAssetType) {
      case "crypto":
        return (
          <CryptoAssetForm
            formData={formData as AssetFormData["crypto"]}
            onFormDataChange={onFormDataChange}
          />
        );
      case "realEstate":
        return (
          <RealEstateAssetForm
            formData={formData as AssetFormData["realEstate"]}
            onFormDataChange={onFormDataChange}
          />
        );
      case "stock":
        return (
          <StockAssetForm
            formData={formData as AssetFormData["stock"]}
            onFormDataChange={onFormDataChange}
          />
        );
      case "cash":
        return (
          <CashAssetForm
            formData={formData as AssetFormData["cash"]}
            onFormDataChange={onFormDataChange}
          />
        );
      case "exotic":
        return (
          <ExoticAssetForm
            formData={formData as AssetFormData["exotic"]}
            onFormDataChange={onFormDataChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Asset type specific form */}
      {renderAssetTypeForm()}
    </div>
  );
}
