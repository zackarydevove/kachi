import { Loader2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export default function DeleteAssetDialog({
  deleteDialogOpen,
  setDeleteDialogOpen,
  onDelete,
  onCancel,
  loading,
}: {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  onDelete: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            asset and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
