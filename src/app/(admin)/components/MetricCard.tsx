import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  type: "revenue" | "subscriptions" | "sales" | "active";
}

const icons = {
  revenue: DollarSign,
  subscriptions: Users,
  sales: CreditCard,
  active: Activity,
};

export function MetricCard({ title, value, change, type }: MetricCardProps) {
  const Icon = icons[type];

  return (
    <Card className="transition-transform hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{change}</p>
        </div>
      </CardContent>
    </Card>
  );
}
