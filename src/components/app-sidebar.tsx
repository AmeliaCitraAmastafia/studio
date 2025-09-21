"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, BedDouble, CalendarCheck, LogOut, FileText } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    ...(user
      ? [
          {
            href: "/dashboard",
            label: "Dashboard",
            icon: Home,
            roles: ["admin", "cashier"],
          },
          {
            href: "/dashboard/bookings",
            label: "Bookings",
            icon: CalendarCheck,
            roles: ["admin", "cashier"],
          },
          {
            href: "/dashboard/rooms",
            label: "Rooms",
            icon: BedDouble,
            roles: ["admin", "cashier"],
          },
          {
            href: "/dashboard/logs",
            label: "Logs",
            icon: FileText,
            roles: ["admin"],
          },
        ]
      : []),
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-semibold font-headline">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z"/><path d="M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5v0a5 5 0 0 1-5-5z"/></svg>
          <span className="text-xl text-sidebar-foreground">Hotel ra'as</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
