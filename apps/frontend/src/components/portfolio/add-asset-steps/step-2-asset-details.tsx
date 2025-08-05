"use client";

import React from "react";
import { AssetFormData, AssetType } from "./types";
import CryptoAssetForm from "./crypto-asset-form";
import RealEstateAssetForm from "./real-estate-asset-form";
import StockAssetForm from "./stock-asset-form";
import CashAssetForm from "./cash-asset-form";
import ExoticAssetForm from "./exotic-asset-form";

interface Step2Props {
  selectedAssetType: AssetType;
  formData: AssetFormData;
  onFormDataChange: (field: string, value: string) => void;
}

export default function Step2AssetDetails({
  selectedAssetType,
  formData,
  onFormDataChange,
}: Step2Props) {
  const renderAssetTypeForm = () => {
    switch (selectedAssetType) {
      case "crypto":
        return (
          <CryptoAssetForm
            formData={formData}
            onFormDataChange={onFormDataChange}
          />
        );
      case "realEstate":
        return (
          <RealEstateAssetForm
            formData={formData}
            onFormDataChange={onFormDataChange}
          />
        );
      case "stock":
        return (
          <StockAssetForm
            formData={formData}
            onFormDataChange={onFormDataChange}
          />
        );
      case "cash":
        return (
          <CashAssetForm
            formData={formData}
            onFormDataChange={onFormDataChange}
          />
        );
      case "exotic":
        return (
          <ExoticAssetForm
            formData={formData}
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
