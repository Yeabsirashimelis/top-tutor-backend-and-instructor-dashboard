"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeleteonLoader3() {
  return (
    <Card className="w-[600px] mx-auto">
      <CardHeader>
        <CardTitle className="text-sm">
          <Skeleton className="h-4 w-3/4" />
        </CardTitle>
        <CardDescription className="text-xs">
          <Skeleton className="h-3 w-1/2" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] md:h-[300px] flex">
          <div className="w-1/2 flex items-center justify-center">
            <Skeleton className="h-[160px] w-[160px] rounded-full" />
          </div>
          <div className="w-1/2 flex flex-col justify-center space-y-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
