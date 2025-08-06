import React from "react";
import { Label } from "../../ui/label";
import { AssetFormData } from "@/types/asset.type";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RealEstateAssetFormProps {
  formData: AssetFormData["realEstate"];
  onFormDataChange: (field: string, value: string) => void;
}

const mockRealEstateTypes = [
  {
    name: "main_property",
    label: "Main property",
  },
  {
    name: "rental",
    label: "Rental",
  },
];

const mockRealEstateCategories = [
  {
    name: "main_property",
    label: "Main property",
  },
  {
    name: "rental",
    label: "Rental",
  },
];

export default function RealEstateAssetForm({
  formData,
  onFormDataChange,
}: RealEstateAssetFormProps) {
  console.log(" in real estate component formData : ", formData);
  return (
    <div className="space-y-2">
      {/* Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Main House"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onFormDataChange("name", e.target.value)
          }
          required
        />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          placeholder="123 St. Robert, Los Angeles"
          value={formData.address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onFormDataChange("address", e.target.value)
          }
          required
        />
      </div>

      <div className="flex gap-2 justify-between">
        {/* - Type (Appartment, house, building, parking, land, commercial, other) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="address">Type</Label>
          <Select
            value={formData.realEstateType}
            onValueChange={(value) => onFormDataChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Types</SelectLabel>
                {mockRealEstateTypes.map((type) => (
                  <SelectItem key={type.name} value={type.name}>
                    <span className="font-medium">{type.label}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* - Category (Residence, Vacation Home, Rental, Other) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="address">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => onFormDataChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                {mockRealEstateCategories.map((type) => (
                  <SelectItem key={type.name} value={type.name}>
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="cost">Cost</Label>
        <Input
          id="cost"
          type="number"
          placeholder="0"
          value={formData.cost}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onFormDataChange("cost", e.target.value)
          }
          required
        />
      </div>
    </div>
  );
}
