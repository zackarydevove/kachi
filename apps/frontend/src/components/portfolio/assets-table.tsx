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
import EditAssetDialog from "./edit-asset-dialog";
import { Asset, AssetType, AssetFormData } from "@/types";
import { useAssetStore } from "@/store/asset.store";

export default function AssetsTable() {
  const assetGroups = useAssetStore((state) => state.assetGroups);
  const getAllAssets = useAssetStore((state) => state.getAllAssets);
  const updateAsset = useAssetStore((state) => state.updateAsset);
  const deleteAsset = useAssetStore((state) => state.deleteAsset);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [editFormData, setEditFormData] = useState<
    AssetFormData[AssetType] | null
  >(null);

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
    let formData: AssetFormData[AssetType];

    switch (asset.type) {
      case "crypto":
      case "stock":
        formData = {
          name: String(asset.name),
          unitPrice: String(asset.unitPrice),
          quantity: String(asset.quantity),
        } as AssetFormData[AssetType];
        break;
      case "realEstate":
        formData = {
          name: String(asset.name),
          address: String(asset.address),
          realEstateType: String(asset.realEstateType),
          category: String(asset.category),
          cost: String(asset.cost),
        } as AssetFormData[AssetType];
        break;
      case "cash":
        formData = {
          cashType: String(asset.cashType),
          currency: String(asset.currency),
          quantity: String(asset.quantity),
        } as AssetFormData[AssetType];
        break;
      case "exotic":
        formData = {
          name: String(asset.name),
          quantity: String(asset.quantity),
          buyingPrice: String(asset.buyingPrice),
          currentPrice: String(asset.currentPrice),
        } as AssetFormData[AssetType];
        break;
      default:
        formData = {} as AssetFormData[AssetType];
    }

    setSelectedAsset(asset);
    setEditFormData(formData);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (data: AssetFormData[AssetType]) => {
    if (selectedAsset && data)
      updateAsset(selectedAsset.type, selectedAsset.id, data);
    setEditDialogOpen(false);
    setSelectedAsset(null);
    setEditFormData(null);
  };

  const handleDeleteClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedAsset) deleteAsset(selectedAsset.type, selectedAsset.id);
    closeDeleteDialog();
  };

  return (
    <>
      <table className="border-separate border-spacing-y-2">
        <thead className="text-sm text-muted-foreground">
          <tr className="grid grid-cols-4 pr-6 py-2">
            <th className="cursor-pointer text-xs text-left">Name</th>
            <th className="cursor-pointer text-xs text-right">Split</th>
            <th className="cursor-pointer text-xs text-right">Value</th>
            <th className="cursor-pointer text-xs text-right">1Y P&L</th>
          </tr>
        </thead>
        {assetGroups.map((group) => (
          <tbody key={group.id} className="rounded-md">
            <tr
              className={cn(
                "grid grid-cols-4 items-center px-6 py-3 bg-secondary rounded-t-md",
                openGroups[group.name] ? "rounded-t-md" : "rounded-md"
              )}
            >
              <th className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => toggleGroup(group.name)}
                >
                  {openGroups[group.name] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </Button>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <Link
                  href={`/portfolio/${group.name.toLowerCase()}`}
                  className="font-medium ml-1 hover:underline"
                >
                  {group.name}
                </Link>
              </th>
              <th className="text-right">{group.split}%</th>
              <th className="text-right">${group.value.toLocaleString()}</th>
              <th className="text-right text-green-500">{group.pnl}</th>
            </tr>
            {openGroups[group.name] &&
              group.assets?.map((asset) => (
                <tr
                  key={asset.id}
                  className={cn(
                    "grid grid-cols-4 items-center px-6 py-3 bg-secondary",
                    group.assets[0] === asset && "border-t border-border",
                    group.assets[group.assets.length - 1] === asset &&
                      "rounded-b-md"
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
                  <td className="text-right text-sm">{asset.split}%</td>
                  <td className="text-right text-sm">
                    ${asset.value.toLocaleString()}
                  </td>
                  <td className="text-right text-sm text-green-500">
                    {asset.pnl}
                  </td>
                </tr>
              ))}
          </tbody>
        ))}
      </table>
      {/* Edit Dialog */}
      {selectedAsset &&
        editFormData &&
        (() => {
          const group = assetGroups.find((g) =>
            g.assets.some((asset) => asset.id === selectedAsset.id)
          );
          const assetType = group?.type;

          return assetType ? (
            <EditAssetDialog
              open={editDialogOpen}
              setOpen={setEditDialogOpen}
              assetType={assetType}
              initialFormData={editFormData}
              onSave={handleSaveEdit}
            />
          ) : null;
        })()}
      {/* Delete Dialog */}
      <DeleteAssetDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        onDelete={handleDeleteConfirm}
        onCancel={closeDeleteDialog}
      />
    </>
  );
}
