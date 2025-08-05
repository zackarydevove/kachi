import React from "react";
import { AssetFormData } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CashAssetFormProps {
  formData: AssetFormData["cash"];
  onFormDataChange: (field: string, value: string) => void;
}

const mockCashAccountTypeList = [
  {
    name: "main_account",
    label: "Main account",
  },
  {
    name: "credit_card",
    label: "Credit card",
  },
  {
    name: "saving_account",
    label: "Saving account",
  },
  {
    name: "shared_account",
    label: "Shared account",
  },
];

const mockCurrencyList = [
  {
    sign: "$",
    label: "USD",
  },
  {
    sign: "€",
    label: "EUR",
  },
];

export default function CashAssetForm({
  formData,
  onFormDataChange,
}: CashAssetFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span>Select a cash</span>
        <Select
          value={formData.cashType || ""}
          onValueChange={(value) => onFormDataChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a stock" />
          </SelectTrigger>
          <SelectContent>
            {mockCashAccountTypeList.map((cash) => (
              <SelectItem key={cash.name} value={cash.name}>
                <div className="flex items-center gap-2">{cash.label}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-2">
          <span>Select a currency</span>
          <Select
            value={formData.currency || ""}
            onValueChange={(value) => onFormDataChange("currency", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent>
              {mockCurrencyList.map((currency) => (
                <SelectItem key={currency.label} value={currency.label}>
                  <div className="flex items-center gap-2">
                    {currency.label} - {currency.sign}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="0"
            value={formData.quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFormDataChange("quantity", e.target.value)
            }
            required
          />
        </div>
      </div>
    </div>
  );
}
