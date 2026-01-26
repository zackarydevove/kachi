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
import { useRouter } from "next/navigation";

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

export default function AssetsTable({ filterType }: { filterType?: AssetType }) {
  const split = useAssetStore((state) => state.split);
  const deleteAsset = useAssetStore((state) => state.deleteAsset);
  const router = useRouter();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleDeleteConfirm = async () => {
    try {
      if (selectedAsset) {
        setLoading(true);
        await deleteAsset(selectedAsset.id);
      }
    } catch (error) {
      console.error("Failed to delete asset:", error);
    } finally {
      setLoading(false);
      closeDeleteDialog();
    }
  };

  // Filter split by type if filterType is provided
  const filteredSplit = filterType
    ? { [filterType]: split[filterType] }
    : split;

  // Count split[type].assets.length and if total is 0 return the div
  const totalAssets = Object.values(filteredSplit).reduce(
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
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="border-separate border-spacing-y-2 w-full">
          <thead className="text-sm text-muted-foreground">
            <tr className="grid grid-cols-4 pr-6 py-2">
              <th className="cursor-pointer text-xs text-left">Name</th>
              <th className="cursor-pointer text-xs text-right">Split</th>
              <th className="cursor-pointer text-xs text-right">Value</th>
              <th className="cursor-pointer text-xs text-right">1Y P&L</th>
            </tr>
          </thead>
          {Object.keys(filteredSplit).map((t) => {
            const type = t as AssetType;
            if (type === "networth" || filteredSplit[type].assets.length === 0) return;
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
                        filteredSplit[type].assets.length > 0 && toggleGroup(type)
                      }
                    >
                      {openGroups[type] ? (
                        <ChevronDown size={16} />
                      ) : filteredSplit[type].assets.length > 0 ? (
                        <ChevronRight size={16} />
                      ) : null}
                    </Button>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: assetTypeColor[type] }}
                    />
                    <span 
                      className={cn(
                        "font-medium ml-1",
                        !filterType && "hover:underline cursor-pointer"
                      )}
                      onClick={() => !filterType && router.push(`/portfolio/${type}`)}
                    >
                      {assetTypeLabels[type]}
                    </span>
                  </th>
                  <th className="text-right">
                    {filteredSplit[type].split.toFixed(0)}%
                  </th>
                  <th className="text-right">
                    ${filteredSplit[type].value.toLocaleString()}
                  </th>
                  <th
                    className={cn(
                      "text-right",
                      formatPnL(filteredSplit[type].pnl).className
                    )}
                  >
                    {formatPnL(filteredSplit[type].pnl).display}
                  </th>
                </tr>
                {openGroups[type] &&
                  filteredSplit[type].assets?.map((asset) => (
                    <tr
                      key={asset.id}
                      className={cn(
                        "grid grid-cols-4 items-center px-6 py-3 bg-secondary",
                        filteredSplit[type].assets[0] === asset &&
                          "border-t border-border",
                        filteredSplit[type].assets[filteredSplit[type].assets.length - 1] ===
                          asset && "rounded-b-md"
                      )}
                    >
                      <td className="flex items-center gap-2">
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
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {Object.keys(filteredSplit).map((t) => {
          const type = t as AssetType;
          if (type === "networth" || filteredSplit[type].assets.length === 0) return;
          return (
            <div key={type} className="space-y-2">
              {/* Category Header */}
              <div
                className={cn(
                  "flex items-center justify-between p-4 bg-secondary rounded-lg",
                  openGroups[type] && "rounded-b-none"
                )}
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() =>
                      filteredSplit[type].assets.length > 0 && toggleGroup(type)
                    }
                  >
                    {openGroups[type] ? (
                      <ChevronDown size={16} />
                    ) : filteredSplit[type].assets.length > 0 ? (
                      <ChevronRight size={16} />
                    ) : null}
                  </Button>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: assetTypeColor[type] }}
                  />
                  <span 
                    className={cn(
                      "font-medium",
                      !filterType && "hover:underline cursor-pointer"
                    )}
                    onClick={() => !filterType && router.push(`/portfolio/${type}`)}
                  >
                    {assetTypeLabels[type]}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {filteredSplit[type].split.toFixed(0)}%
                  </span>
                  <span className="font-medium">
                    ${filteredSplit[type].value.toLocaleString()}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      formatPnL(filteredSplit[type].pnl).className
                    )}
                  >
                    {formatPnL(filteredSplit[type].pnl).display}
                  </span>
                </div>
              </div>

              {/* Individual Assets */}
              {openGroups[type] &&
                filteredSplit[type].assets?.map((asset, index) => (
                  <div
                    key={asset.id}
                    className={cn(
                      "flex items-center justify-between p-4 bg-secondary",
                      index === 0 && "rounded-t-lg",
                      index === filteredSplit[type].assets.length - 1 && "rounded-b-lg"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">
                        {asset.name}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-4 p-4 rounded-full hover:bg-secondary-hover shrink-0"
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
                    </div>
                    <div className="flex items-center gap-4 text-sm ml-3">
                      <span className="text-muted-foreground min-w-0">
                        {asset.split.toFixed(0)}%
                      </span>
                      <span className="font-medium min-w-0">
                        ${asset.value.toLocaleString()}
                      </span>
                      <span
                        className={cn(
                          "text-sm min-w-0",
                          formatPnL(asset.pnl).className
                        )}
                      >
                        {formatPnL(asset.pnl).display}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
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
        loading={loading}
      />
    </div>
  );
}
