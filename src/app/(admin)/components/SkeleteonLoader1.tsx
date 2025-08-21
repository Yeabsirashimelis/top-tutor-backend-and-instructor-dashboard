"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoader1() {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle className="text-sm">
          <Skeleton className="h-4 w-3/4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] md:h-[300px] space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20" /> {/* Category name */}
              <Skeleton
                className={`h-8 w-${Math.floor(Math.random() * 60 + 20)}%`}
              />{" "}
              {/* Bar */}
              <Skeleton className="h-4 w-8" /> {/* Number */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
