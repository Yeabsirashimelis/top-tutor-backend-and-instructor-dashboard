"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export default function ProtectedRoute({
  children,
  redirectPath = "/auth/signin",
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const excludedRoutes = ["/auth/signin"];
  useEffect(() => {
    if (status === "unauthenticated" && !excludedRoutes.includes(pathname)) {
      router.replace(redirectPath);
    }
  }, [status, router, redirectPath, pathname]);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(redirectPath); // redirect if not logged in
    }
  }, [status, router, redirectPath]);

  // Only render children if authenticated
  if (status === "loading") return null; // or a spinner
  if (status === "unauthenticated") return null;

  return <>{children}</>;
}
