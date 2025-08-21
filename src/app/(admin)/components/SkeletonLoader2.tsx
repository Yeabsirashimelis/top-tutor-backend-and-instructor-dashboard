"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoader2() {
  return (
    <div className="flex">
      <Card className="w-[600px]  mx-auto">
        <CardHeader>
          <CardTitle className="text-sm">
            <Skeleton className="h-4 w-1/2" />
          </CardTitle>
          <CardDescription className="text-xs">
            <Skeleton className="h-3 w-3/4" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px]">
            <div className="flex justify-between mb-2">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-3 w-8" /> // X-axis labels
              ))}
            </div>
            <div className="relative h-[200px]">
              {[...Array(12)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="absolute bottom-0 w-[7%]"
                  style={{
                    height: `${Math.random() * 80 + 20}%`,
                    left: `${index * 8.33}%`,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-3 w-8" /> // X-axis labels
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
