"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { useGetOrderByMonthStatistics } from "../_hooks/statistics-hook"
import SkeletonLoader2 from "./SkeletonLoader2"

type OrderData = {
  year: number
  month: number
  monthName: string
  orderCount: number
}

export default function OrdersByMonth() {
  const { data, isPending, error } = useGetOrderByMonthStatistics()

  const orderData = Array.isArray(data) ? data : []

  if (isPending) {
    return <SkeletonLoader2 />
  }

  if (error || orderData.length === 0) {
    return <div className="w-[600px] h-[250px] md:h-[300px] flex items-center justify-center">NO DATA FOUND</div>;
  }


  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle className="text-sm md:text-base">Monthly Orders</CardTitle>
        <CardDescription className="text-xs md:text-sm">Orders per month (last 12 months)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            orderCount: {
              label: "Order Count",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[250px] md:h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderData} margin={{ top: 0, right: 60, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="monthName"
                stroke="#888888"
                fontSize={10}
                tickLine={true}
                axisLine={true}
                tickFormatter={(value, index) => `${value.slice(0, 3)} ${orderData[index].year}`}
              />
              <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={true} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as OrderData
                    return (
                      <div className="bg-white p-2 border border-gray-300 rounded shadow-md text-xs">
                        <p className="font-semibold">{`${data.monthName} ${data.year}`}</p>
                        <p>{`Orders: ${data.orderCount}`}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar
                dataKey="orderCount"
                fill="#F5A94E"
                radius={[3, 3, 0, 0]}
                className="transition-all duration-300 hover:opacity-80"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

