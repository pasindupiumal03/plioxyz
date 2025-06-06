import type * as React from "react"
import { Home, BarChart3, Users, Settings, MessageCircle, Wallet, TrendingUp, Grid3X3 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    icon: Home,
    href: "#",
  },
  {
    icon: BarChart3,
    href: "#",
  },
  {
    icon: Grid3X3,
    href: "#",
  },
  {
    icon: TrendingUp,
    href: "#",
  },
  {
    icon: Users,
    href: "#",
  },
  {
    icon: MessageCircle,
    href: "#",
  },
  {
    icon: Wallet,
    href: "#",
  },
  {
    icon: Settings,
    href: "#",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild className="w-full justify-center p-3 hover:bg-gray-800 rounded-lg">
                <a href={item.href}>
                  <item.icon className="h-5 w-5 text-gray-400" />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
