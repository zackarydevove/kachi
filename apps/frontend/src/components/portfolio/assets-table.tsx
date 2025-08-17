"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight, Ellipsis } from "lucide-react";
import Link from "next/link";
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

export default function AssetsTable() {
  const split = useAssetStore((state) => state.split);
  const getAllAssets = useAssetStore((state) => state.getAllAssets);
  const deleteAsset = useAssetStore((state) => state.deleteAsset);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  useEffect(() => {
    getAllAssets();
  }, [getAllAssets]);

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

  return (
    <div className="bg-component rounded-md p-6 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p>Assets</p>
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
          if (type === "networth") return;
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
                    onClick={() => toggleGroup(type)}
                  >
                    {openGroups[type] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </Button>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: assetTypeColor[type] }}
                  />
                  <Link
                    href={`/portfolio/${type.toLowerCase()}`}
                    className="font-medium ml-1 hover:underline"
                  >
                    {assetTypeLabels[type]}
                  </Link>
                </th>
                <th className="text-right">{split[type].split.toFixed(0)}%</th>
                <th className="text-right">
                  ${split[type].value.toLocaleString()}
                </th>
                <th className="text-right text-green-500">{split[type].pnl}</th>
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
                    <td className="text-right text-sm text-green-500">
                      {asset.pnl}
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
