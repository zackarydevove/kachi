"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight, Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DeleteAssetDialog from "./delete-asset-dialog";
import {
  Asset,
  AssetType,
  assetTypeColor,
  assetTypeLabels,
} from "@/types/asset.type";
import { useAssetStore } from "@/store/asset.store";
import EditAssetDialog from "./edit-asset-dialog";
import AddAssetDialog from "./add-asset-dialog";

// Utility function to format PnL values with proper colors and formatting
const formatPnL = (pnl: number) => {
  const isPositive = pnl >= 0;
  const formattedValue = Math.abs(pnl).toLocaleString();
  const sign = isPositive ? "+" : "-";

  return {
    display: `${sign}$${formattedValue}`,
    className: isPositive ? "text-constructive" : "text-destructive",
  };
};

export default function AssetsTable() {
  const split = useAssetStore((state) => state.split);
  const deleteAsset = useAssetStore((state) => state.deleteAsset);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleEditClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setDeleteDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedAsset(null);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedAsset(null);
  };

  const handleEditDialogClose = (open: boolean) => {
    if (!open) {
      closeEditDialog();
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedAsset) deleteAsset(selectedAsset.id);
    closeDeleteDialog();
  };

  // Count split[type].assets.length and if total is 0 return the div
  const totalAssets = Object.values(split).reduce(
    (acc, type) => acc + type.assets.length,
    0
  );

  if (totalAssets === 0) {
    return (
      <div className="bg-component rounded-md p-6 flex flex-col gap-5">
        <p className="text-lg font-semibold">Assets</p>
        <div className="flex justify-center items-center w-full pb-10">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-medium">No portfolio data</p>
              <p className="text-sm text-muted-foreground">
                Add some assets to see your portfolio breakdown
              </p>
            </div>
            <AddAssetDialog />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-component rounded-md p-6 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Assets</p>
        <AddAssetDialog />
      </div>
      <table className="border-separate border-spacing-y-2">
        <thead className="text-sm text-muted-foreground">
          <tr className="grid grid-cols-4 pr-6 py-2">
            <th className="cursor-pointer text-xs text-left">Name</th>
            <th className="cursor-pointer text-xs text-right">Split</th>
            <th className="cursor-pointer text-xs text-right">Value</th>
            <th className="cursor-pointer text-xs text-right">1Y P&L</th>
          </tr>
        </thead>
        {Object.keys(split).map((t) => {
          const type = t as AssetType;
          if (type === "networth" || split[type].assets.length === 0) return;
          return (
            <tbody key={type} className="rounded-md">
              <tr
                className={cn(
                  "grid grid-cols-4 items-center px-6 py-3 bg-secondary rounded-t-md",
                  openGroups[type] ? "rounded-t-md" : "rounded-md"
                )}
              >
                <th className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() =>
                      split[type].assets.length > 0 && toggleGroup(type)
                    }
                  >
                    {openGroups[type] ? (
                      <ChevronDown size={16} />
                    ) : split[type].assets.length > 0 ? (
                      <ChevronRight size={16} />
                    ) : null}
                  </Button>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: assetTypeColor[type] }}
                  />
                  <span className="font-medium ml-1">
                    {assetTypeLabels[type]}
                  </span>
                </th>
                <th className="text-right">{split[type].split.toFixed(0)}%</th>
                <th className="text-right">
                  ${split[type].value.toLocaleString()}
                </th>
                <th
                  className={cn(
                    "text-right",
                    formatPnL(split[type].pnl).className
                  )}
                >
                  {formatPnL(split[type].pnl).display}
                </th>
              </tr>
              {openGroups[type] &&
                split[type].assets?.map((asset) => (
                  <tr
                    key={asset.id}
                    className={cn(
                      "grid grid-cols-4 items-center px-6 py-3 bg-secondary",
                      split[type].assets[0] === asset &&
                        "border-t border-border",
                      split[type].assets[split[type].assets.length - 1] ===
                        asset && "rounded-b-md"
                    )}
                  >
                    <td className="flex items-center gap-2">
                      <span className="bg-black w-8 h-8 rounded-full" />
                      <span className="text-sm">{asset.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-4 p-4 rounded-full hover:bg-secondary-hover"
                          >
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                handleEditClick(asset);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                handleDeleteClick(asset);
                              }}
                              className="text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="text-right text-sm">
                      {asset.split.toFixed(0)}%
                    </td>
                    <td className="text-right text-sm">
                      ${asset.value.toLocaleString()}
                    </td>
                    <td
                      className={cn(
                        "text-right text-sm",
                        formatPnL(asset.pnl).className
                      )}
                    >
                      {formatPnL(asset.pnl).display}
                    </td>
                  </tr>
                ))}
            </tbody>
          );
        })}
      </table>
      {/* Edit Dialog */}
      {editDialogOpen && selectedAsset && (
        <EditAssetDialog
          asset={selectedAsset}
          open={editDialogOpen}
          onOpenChange={handleEditDialogClose}
        />
      )}
      {/* Delete Dialog */}
      <DeleteAssetDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        onDelete={handleDeleteConfirm}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}
