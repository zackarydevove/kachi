"use client";

import { AssetType, assetTypeLabels } from "@/types/asset.type";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { cn } from "@/lib/utils";

interface Step1Props {
  selectedAssetType: AssetType | null;
  onAssetTypeSelect: (assetType: AssetType) => void;
}

export default function Step1AssetTypeSelection({
  selectedAssetType,
  onAssetTypeSelect,
}: Step1Props) {
  const assetTypes: AssetType[] = Object.keys(assetTypeLabels) as AssetType[];
  console.log("selectedAssetType: ", selectedAssetType);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assetTypes.map((assetType) => (
        <Card
          key={assetType}
          className={cn(
            "cursor-pointer hover:bg-card-hover transition-shadow",
            selectedAssetType === assetType && "bg-card-hover"
          )}
          onClick={() => onAssetTypeSelect(assetType)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {assetTypeLabels[assetType]}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
