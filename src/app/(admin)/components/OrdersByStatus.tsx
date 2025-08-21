"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import SkeleteonLoader3 from "./SkeletonLoader3"
import { useGetOrderStatusStatistics } from "../_hooks/statistics-hook"

type OrderStatus = "Shipped" | "Confirmed" | "Pending" | "Cancelled"

type OrderStatusData = {
  name: OrderStatus
  value: number
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export default function OrderByStatus() {
  const { data, isPending, error } = useGetOrderStatusStatistics()

  const orderData: OrderStatusData[] =
    data && typeof data === "object"
      ? Object.entries(data).map(([key, value]) => ({
          name: key as OrderStatus,
          value: value as number,
        }))
      : []

  if (isPending) {
    return <SkeleteonLoader3 />
  }

  if (error || orderData.length === 0) {
    return <div className="w-[600px] h-[250px] md:h-[300px] flex items-center justify-center">NO DATA FOUND</div>;
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle className="text-sm md:text-base">Order Status Distribution</CardTitle>
        <CardDescription className="text-xs md:text-sm">Current status of all orders</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            Shipped: { label: "Shipped", color: COLORS[0] },
            Confirmed: { label: "Confirmed", color: COLORS[1] },
            Pending: { label: "Pending", color: COLORS[2] },
            Cancelled: { label: "Cancelled", color: COLORS[3] },
          }}
          className="h-[250px] md:h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {orderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as OrderStatusData
                    return (
                      <div className="bg-white p-4 border border-gray-300 rounded shadow-md">
                        <p className="font-semibold">{data.name}</p>
                        <p>{`Orders: ${data.value}`}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

