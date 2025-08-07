"use client";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Loader2Icon, Pencil, Plus } from "lucide-react";
import { useAccountStore } from "@/store/account.store";
import { useState, useEffect } from "react";
import { Account, AccountForm } from "@/types/account.type";
import { parseSchemaError } from "@/utils/parse-schema.util";
import { accountFormSchema } from "@/schemas/account.schema";
import DeleteAccountDialog from "./delete-account-dialog";

export default function EditSubAccountDialog(props: {
  type: "edit" | "create";
  account?: Account;
}) {
  const editType = props.type === "edit";

  const resetFormData = (): AccountForm => ({
    name: props.account?.name || "",
    avatar: props.account?.avatar || "",
  });

  const [formData, setFormData] = useState<AccountForm>(resetFormData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; path: string } | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const { createAccount, editAccount, deleteAccount } = useAccountStore();

  // Update form data when account prop changes
  useEffect(() => {
    setFormData(resetFormData());
    setError(null);
  }, [props.account, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit called!");
    e.preventDefault();

    console.log("formData", formData);

    if (!parseSchemaError<AccountForm>(formData, accountFormSchema, setError)) {
      console.log("error", error);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editType && props.account) {
        await editAccount(props.account.id, formData);
      } else {
        await createAccount(formData);
      }
      setFormData(resetFormData());
      setOpen(false); // Close dialog only on success
    } catch (error: unknown) {
      console.error(
        `Error ${editType ? "updating" : "creating"} account:`,
        error
      );
      setError(
        // If error is 409, show error message
        (error as { response?: { status: number } })?.response?.status === 409
          ? {
              message: "Account with this name already exists",
              path: "name",
            }
          : {
              message: `Failed to ${
                editType ? "update" : "create"
              } account. Please try again.`,
              path: "avatar", // general error
            }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (key: string, value: string) => {
    const newFormData = { ...formData, [key]: value };
    setFormData(newFormData);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (!props.account) {
        console.error("No account to delete");
        setError({
          message: "No account to delete",
          path: "avatar",
        });
        return;
      }
      await deleteAccount(props.account.id);
      setFormData(resetFormData());
      setOpen(false);
    } catch (error: unknown) {
      console.error("Error deleting account:", error);
      setError({
        message:
          (error as { response?: { data: { message: string } } })?.response
            ?.data?.message || "Failed to delete account. Please try again.",
        path: "avatar", // general error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="z-50">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {editType ? (
            <Button variant="outline" size={"icon"} className="size-6">
              <Pencil size={1} />
            </Button>
          ) : (
            <div className="flex items-center gap-2 hover:bg-accent hover:cursor-pointer p-2 text-muted-foreground font-medium text-sm">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <p>Add team</p>
            </div>
          )}
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          deleteDialog={
            editType && <DeleteAccountDialog handleDelete={handleDelete} />
          }
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>
                {editType ? "Edit profile" : "Create profile"}
              </DialogTitle>
              <DialogDescription>
                {editType
                  ? "Make changes to your profile here. Click save when you're done."
                  : "Create another profile here. Click create when you're done."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name-1">Name</Label>
                <Input
                  id="name-1"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                />
                {error?.path === "name" && (
                  <p className="text-sm text-red-500">{error?.message}</p>
                )}
              </div>
              {/* TODO: Implement avatar later */}
              <div className="flex flex-col gap-3">
                <p>Here implement avatar later</p>
                {error?.path === "avatar" && (
                  <p className="text-sm text-red-500">{error?.message}</p>
                )}
              </div>
            </div>
            <DialogFooter className="flex">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : editType ? (
                    "Save changes"
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
