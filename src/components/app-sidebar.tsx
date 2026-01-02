import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Book, DollarSign, BarChart2, Users, Megaphone, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logout from "./Logout";

const pages = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart2,
  },
  {
    title: "Students",
    url: "/students",
    icon: Users,
  },
  {
    title: "Announcements",
    url: "/announcements",
    icon: Megaphone,
  },
  {
    title: "courses",
    url: "/courses",
    icon: Book,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: DollarSign,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                <img
                  src="/images/logo.jpg"
                  className="rounded-lg h-10 w-10 object-cover"
                  alt="TOP-TUTOR Logo"
                />
              </div>
              <span className="text-indigo-600 font-extrabold text-2xl">
                TOP-TUTOR
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pages.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} prefetch={true}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* <Logout /> */}
      </SidebarFooter>
    </Sidebar>
  );
}
