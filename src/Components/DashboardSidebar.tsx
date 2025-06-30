"use client";

import { IconType } from "react-icons";
import { 
  RiUser3Line, 
  RiTrophyLine, 
  RiFileTextLine, 
  RiTeamLine, 
  RiNotification3Line, 
  RiSettings4Line 
} from "react-icons/ri";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface SidebarItem {
  name: string;
  icon: IconType;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "Profile", icon: RiUser3Line, path: "/dashboard" },
  { name: "Challenges", icon: RiTrophyLine, path: "/dashboard/challenges" },
  { name: "Posts", icon: RiFileTextLine, path: "/dashboard/posts" },
  { name: "Teams", icon: RiTeamLine, path: "/dashboard/teams" },
  { name: "Notifications", icon: RiNotification3Line, path: "/dashboard/notifications" },
  { name: "Settings", icon: RiSettings4Line, path: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border p-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <h1 className="text-2xl font-bold text-primary">CodeHub</h1>
      </div>
      
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              pathname === item.path
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}