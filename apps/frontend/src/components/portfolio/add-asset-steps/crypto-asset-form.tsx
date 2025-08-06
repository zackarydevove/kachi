"use client";

import React from "react";
import { AssetFormData } from "@/types/asset.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CryptoAssetFormProps {
  formData: AssetFormData["crypto"];
  onFormDataChange: (field: string, value: string) => void;
}

const mockCryptoList = [
  {
    value: "BTC",
    label: "Bitcoin",
    logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501628",
  },
  {
    value: "ETH",
    label: "Ethereum",
    logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501625",
  },
  {
    value: "SOL",
    label: "Solana",
    logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
  },
  {
    value: "XRP",
    label: "XRP",
    logo: "https://assets.coingecko.com/coins/images/44/large/ripple.png?1547042194",
  },
  {
    value: "DOGE",
    label: "Dogecoin",
    logo: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1696501626",
  },
];

export default function CryptoAssetForm({
  formData,
  onFormDataChange,
}: CryptoAssetFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span>Select a crypto</span>
        <Select
          value={formData.name || ""}
          onValueChange={(value) => onFormDataChange("name", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a crypto" />
          </SelectTrigger>
          <SelectContent>
            {mockCryptoList.map((crypto) => (
              <SelectItem key={crypto.value} value={crypto.value}>
                <div className="flex items-center gap-2">
                  <Avatar className="rounded-full">
                    <AvatarImage src={crypto.logo} alt={crypto.label} />
                    <AvatarFallback>
                      {crypto.label.charAt(0) + crypto.label.charAt(1)}
                    </AvatarFallback>
                  </Avatar>
                  {crypto.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="unitPrice">Unit Price ($)</Label>
          <Input
            id="unitPrice"
            type="number"
            placeholder="0.00"
            value={formData.unitPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFormDataChange("unitPrice", e.target.value)
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
