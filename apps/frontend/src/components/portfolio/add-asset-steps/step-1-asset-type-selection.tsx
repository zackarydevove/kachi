import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { AssetType } from "./types";

interface Step1Props {
  selectedAssetType: AssetType | "";
  onAssetTypeSelect: (value: AssetType) => void;
}

const assetTypes = [
  {
    value: "crypto",
    label: "Cryptocurrency",
  },
  {
    value: "real_estate",
    label: "Real Estate",
  },
  {
    value: "stock",
    label: "Stocks",
  },
  { value: "cash", label: "Cash", description: "Cash holdings and deposits" },
  {
    value: "exotic",
    label: "Exotic Assets",
  },
];

export default function Step1AssetTypeSelection({
  selectedAssetType,
  onAssetTypeSelect,
}: Step1Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Select
          value={selectedAssetType}
          onValueChange={(value) => onAssetTypeSelect(value as AssetType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose an asset type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Asset Types</SelectLabel>
              {assetTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
