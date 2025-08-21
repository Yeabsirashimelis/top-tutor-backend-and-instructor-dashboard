"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetSpecificOrder } from "../_hooks/order-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Package, User, Calendar, DollarSign } from "lucide-react";

const OrderDetail = () => {
  const { id: orderId } = useParams();
  const { data: order } = useGetSpecificOrder(orderId);
  console.log(order);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-red-100 text-red-800 border-red-300";
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={`${getStatusColor(order.status)}`}>
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-semibold text-lg">${order.totalAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Memo</p>
                <p className="font-semibold text-lg">${order.memo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {order.user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.user.email}
              </p>
              <p>
                <span className="font-medium">User ID:</span> {order.user.id}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order?.orderItems?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.product.image && item.product.image.length > 0 ? (
                      <Carousel className="w-24">
                        <CarouselContent>
                          {item.product.image.map((image, index) => (
                            <CarouselItem key={index}>
                              <Image
                                src={image}
                                height={0}
                                width={0}
                                sizes="100vw"
                                alt={`${item.product.name} - Image ${
                                  index + 1
                                }`}
                                className="w-24 h-24 object-cover rounded"
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>

                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item?.product.name}
                  </TableCell>
                  <TableCell>{item?.quantity}</TableCell>
                  <TableCell>${item?.product.price}</TableCell>
                  <TableCell>${item?.quantity * item.product.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
