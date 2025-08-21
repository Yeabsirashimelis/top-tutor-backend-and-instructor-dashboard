"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign, Users, CreditCard, Activity } from "lucide-react"

const skeletonCards = [
  { title: "Total Revenue", type: "revenue", Icon: DollarSign },
  { title: "Subscriptions", type: "subscriptions", Icon: Users },
  { title: "Sales", type: "sales", Icon: CreditCard },
  { title: "Active Now", type: "active", Icon: Activity },
]

export function SkeletonLoader4() {
  return (
    <div className="mx-auto space-y-2 p-8 bg-gray-50 w-full overflow-auto">
      <h1 className={cn("scroll-m-20 text-3xl font-bold mb-8 tracking-tight")}>Orders Metrics</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {skeletonCards.map((card) => (
          <Card key={card.type} className="transition-transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <Skeleton className="h-4 w-24" />
                <card.Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <Skeleton className="h-8 w-28 mb-1" />
                <Skeleton className="h-4 w-36" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
