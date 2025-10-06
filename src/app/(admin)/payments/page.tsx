"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Payment {
  _id: string;
  user: { name: string; email: string };
  course: { title: string };
  receiptImage?: string;
  status: string;
  createdAt: string;
}

async function fetchPayments(): Promise<Payment[]> {
  const res = await fetch("/api/payments", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch payments");
  const data = await res.json();
  return data.payments;
}

async function updatePaymentStatus(id: string, status: "approved" | "rejected"): Promise<Payment> {
  const res = await fetch(`/api/payments/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update payment status");
  return res.json();
}

export default function AdminApprovalPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: payments, isLoading, isError } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  console.log(payments)

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      updatePaymentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-600 text-center mt-6">Failed to load payments.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administrator Approval</h1>

      <div className="grid gap-4">
        {payments?.map((payment) => (
          <div
            key={payment._id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <h2 className="font-semibold text-lg">
              {payment.course.title} – {payment.user.name}
            </h2>
            <p className="text-sm text-gray-600">{payment.user.email}</p>
            <p className="text-sm text-gray-600">
              Date: {new Date(payment.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2 text-sm">
              Status:{" "}
              <span
                className={
                  payment.status === "approved"
                    ? "text-green-600"
                    : payment.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }
              >
                {payment.status}
              </span>
            </p>

            {/* Receipt Preview */}
      {payment.receiptImage ? (
  <Image
    src={payment.receiptImage}
    alt="Receipt"
    width={30}
    height={30}
    className="cursor-pointer h-[50px] w-[50px] rounded-md"
    onClick={() => setSelectedImage(payment.receiptImage!)}
  />
) : (
  <p className="text-sm text-gray-500">No receipt uploaded</p>
)}


            {/* Approve / reject Buttons */}
            {payment.status === "pending" && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => mutation.mutate({ id: payment._id, status: "approved" })}
                  disabled={mutation.isPending}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {mutation.isPending ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => mutation.mutate({ id: payment._id, status: "rejected" })}
                  disabled={mutation.isPending}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {mutation.isPending ? "Processing..." : "Reject"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for full image */}
  {selectedImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <Image
      src={selectedImage}
      alt="Receipt Full"
      width={800}
      height={600}
      className="rounded-lg"
    />
  </div>
)}

    </div>
  );
}
