"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useGetOrderPerSubcategories } from "../_hooks/statistics-hook"
import SkeletonLoader1 from "./SkeleteonLoader1"

interface OrderStatistics {
  id: string
  name: string
  numberOfOrders: number
}

export default function OrdersBySubcategoryChart() {
  const { data, isPending, error } = useGetOrderPerSubcategories()

  const orderData: OrderStatistics[] = Array.isArray(data) ? data : []

  if (isPending) {
    return <SkeletonLoader1 />
  }

  if (error || orderData.length === 0) {
    return <div className="w-[600px] h-[250px] md:h-[300px] flex items-center justify-center">NO DATA FOUND</div>;
  }


  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle className="text-sm md:text-base">Number of Orders by Subcategory</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            numberOfOrders: {
              label: "Number of Orders",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[250px] md:h-[300px]"
        >
          <BarChart data={orderData} layout="vertical" margin={{ top: 10, right: 60, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 14 }} width={90} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="numberOfOrders" fill="#F5A94E" radius={[0, 4, 4, 0]}>
              <LabelList dataKey="numberOfOrders" position="right" fill="hsl(var(--foreground))" fontSize={14} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

