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

interface StockAssetFormProps {
  formData: AssetFormData["stock"];
  onFormDataChange: (field: string, value: string) => void;
}

const mockStockList = [
  {
    value: "AAPL",
    label: "Apple",
    logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501628",
  },
  {
    value: "GOOGL",
    label: "Google",
    logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501628",
  },
  {
    value: "MSFT",
    label: "Microsoft",
    logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501628",
  },
];

export default function StockAssetForm({
  formData,
  onFormDataChange,
}: StockAssetFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span>Select a stock</span>
        <Select
          value={formData.name || ""}
          onValueChange={(value) => onFormDataChange("name", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a stock" />
          </SelectTrigger>
          <SelectContent>
            {mockStockList.map((stock) => (
              <SelectItem key={stock.value} value={stock.value}>
                <div className="flex items-center gap-2">
                  <Avatar className="rounded-full">
                    <AvatarImage src={stock.logo} alt={stock.label} />
                    <AvatarFallback>
                      {stock.label.charAt(0) + stock.label.charAt(1)}
                    </AvatarFallback>
                  </Avatar>
                  {stock.label}
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
