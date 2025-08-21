"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Orders } from "@prisma/client";
import { useUpdateOrder } from "../_hooks/order-hooks";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EditOrderDialogProps {
  orderToEdit: Orders;
  setOrderToEdit: Dispatch<SetStateAction<Orders | null>>;
}

const EditOrderDialog: React.FC<EditOrderDialogProps> = ({
  orderToEdit,
  setOrderToEdit,
}) => {
  const [status, setStatus] = useState(orderToEdit.status);

  const { mutate: updateOrder, isPending: updateOrderPending } =
    useUpdateOrder();

  const handleStatusUpdate = async () => {
    console.log(orderToEdit, "  ", status);
    updateOrder(
      { id: orderToEdit.id, status: status },
      {
        onSuccess: () => {
          toast({
            title: `Order ${orderToEdit.id} status updated successfully.`,
            description: "Order status updated successfully.",
            variant: "default",
            duration: 3000,
          });
          setOrderToEdit(null);
        },
        onError: (error) => {
          toast({
            title: `Error updating order ${orderToEdit.id}`,
            description: error.message,
            variant: "destructive",
            duration: 3000,
          });
        },
      }
    );
  };
  return (
    <Dialog open={!!orderToEdit} onOpenChange={() => setOrderToEdit(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Update the status of order <strong>{orderToEdit.id}</strong>.
          </p>
          <div className="flex items-center gap-4">
            <Select
              value={status}
              onValueChange={(value: Orders["status"]) => setStatus(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="Pending"
                  className="text-yellow-700 bg-yellow-100"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  value="Confirmed"
                  className="text-green-700 bg-green-100"
                >
                  Confirmed
                </SelectItem>
                <SelectItem
                  value="Cancelled"
                  className="text-red-700 bg-red-100"
                >
                  Cancelled
                </SelectItem>

                <SelectItem
                  value="Shipped"
                  className="text-green-700 bg-green-400"
                >
                  Shipped
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleStatusUpdate}
              variant="default"
              disabled={updateOrderPending}
            >
              Update
              {updateOrderPending && <Loader className="animate-spin" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;
