"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteTicketButtonProps {
  ticketId: string;
  ticketTitle: string;
  hasPurchases: boolean;
}

export function DeleteTicketButton({
  ticketId,
  ticketTitle,
  hasPurchases,
}: DeleteTicketButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Ticket deleted successfully");
        setOpen(false);
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete ticket");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Failed to delete ticket");
    } finally {
      setDeleting(false);
    }
  };

  if (hasPurchases) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        title="Cannot delete ticket with existing purchases"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Delete ticket">
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Ticket</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{ticketTitle}&quot;? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
