"use client";

import { cn } from "@/lib/utils";
import { MetricCard } from "./MetricCard";
import { useGetOrdersStatistics } from "../_hooks/statistics-hook";
import { MetricResponse } from "@/app/api/orders/statistics/route";
import { SkeletonLoader4 } from "./SkeletonLoader4";

export default function OrdersInfo() {
  const {
    data,
    isPending: isLoadingOrderStatistics,
    error,
  } = useGetOrdersStatistics();
  const orderStatistics = data as MetricResponse | null;

  if (isLoadingOrderStatistics) {
    return <SkeletonLoader4 />;
  }

  if (!data || error) {
    return <div>NO DATA FOUND</div>;
  }

  return (
    <div className="mx-auto space-y-2 p-8 bg-gray-50  w-full overflow-auto">
      <h1 className={cn("scroll-m-20 text-3xl font-bold mb-8 tracking-tight")}>
        Orders Metrics
      </h1>
      <div className="grid gap-4 grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${orderStatistics?.totalRevenue.current}`}
          change={`${orderStatistics?.totalRevenue.percentageChange}% from last month`}
          type="revenue"
        />
        <MetricCard
          title="Subscriptions"
          value={`+${orderStatistics?.subscriptions.current}`}
          change={`${orderStatistics?.subscriptions.percentageChange}% from last month`}
          type="subscriptions"
        />
        <MetricCard
          title="Sales"
          value={`+${orderStatistics?.sales.current}`}
          change={`${orderStatistics?.sales.percentageChange}% from last month`}
          type="sales"
        />
        <MetricCard
          title="Active Now"
          value={`${orderStatistics?.activeNow.current ?? "0"}`}
          change={`${orderStatistics?.activeNow.change ?? "0"} since last hour`}
          type="active"
        />
      </div>
    </div>
  );
}
