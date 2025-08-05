import React from "react";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { AssetFormData } from "./types";
import { Input } from "@/components/ui/input";

interface ExoticAssetFormProps {
  formData: AssetFormData;
  onFormDataChange: (field: string, value: string) => void;
}

export default function ExoticAssetForm({
  formData,
  onFormDataChange,
}: ExoticAssetFormProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Watch, Car, Art"
            value={formData.exotic.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFormDataChange("name", e.target.value)
            }
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="0"
            value={formData.exotic.quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFormDataChange("quantity", e.target.value)
            }
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="buyingPrice">Buying Price per Unit ($)</Label>
          <Input
            id="buyingPrice"
            type="number"
            placeholder="0.00"
            value={formData.exotic.buyingPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFormDataChange("buyingPrice", e.target.value)
            }
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="currentPrice">Current Price per Unit ($)</Label>
          <Input
            id="currentPrice"
            type="number"
            placeholder="0.00"
            value={formData.exotic.currentPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFormDataChange("currentPrice", e.target.value)
            }
            required
          />
        </div>
      </div>
    </div>
  );
}
