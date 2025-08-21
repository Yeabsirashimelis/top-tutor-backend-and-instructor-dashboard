"use client";

import OrdersByMonth from "./components/OrdersByMonth";
import OrderByStatus from "./components/OrdersByStatus";
import { cn } from "@/lib/utils";
import OrdersByCategoryChart from "./components/OrderByCategories";
import OrdersBySubcategoryChart from "./components/OrderBySubcategories";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();

  return (
    <div className="capitalize">
      WELCOME TO YOUR DASHBOARD, {session?.user?.name}
    </div>
  );
};

export default Home;
