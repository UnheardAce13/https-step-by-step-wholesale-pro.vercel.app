"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  Settings,
  BarChart,
  Tag,
  Building,
  DollarSign,
  Briefcase,
  Handshake,
  ClipboardList,
  FileText,
  CreditCard,
  Package,
  AreaChart,
  AlertTriangle,
  LayoutDashboard,
} from "lucide-react"

import { SearchForm } from "./search-form"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAuth } from "@/components/providers/auth-provider"
import { createBrowserClient } from "@/lib/supabase"

// Define menu items based on roles
const menuItems = {
  wholesaler: [
    {
      title: "Dashboard",
      url: "/wholesaler",
      icon: LayoutDashboard,
    },
    {
      title: "Properties",
      url: "/wholesaler/properties",
      icon: Building,
    },
    {
      title: "Deals",
      url: "/wholesaler/deals",
      icon: Handshake,
    },
    {
      title: "Offers",
      url: "/wholesaler/offers",
      icon: DollarSign,
    },
    {
      title: "Documents",
      url: "/wholesaler/documents",
      icon: FileText,
    },
    {
      title: "Payments",
      url: "/wholesaler/payments",
      icon: CreditCard,
    },
  ],
  investor: [
    {
      title: "Dashboard",
      url: "/investor",
      icon: LayoutDashboard,
    },
    {
      title: "Available Deals",
      url: "/investor/deals",
      icon: Package,
    },
    {
      title: "My Offers",
      url: "/investor/my-offers",
      icon: DollarSign,
    },
    {
      title: "Portfolio",
      url: "/investor/portfolio",
      icon: Briefcase,
    },
    {
      title: "Documents",
      url: "/investor/documents",
      icon: FileText,
    },
    {
      title: "Payments",
      url: "/investor/payments",
      icon: CreditCard,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "System Health",
      url: "/admin/dashboard/system-health",
      icon: AreaChart,
    },
    {
      title: "User Management",
      url: "/admin/dashboard/users",
      icon: Users,
    },
    {
      title: "Promo Codes",
      url: "/admin/dashboard/promo-codes",
      icon: Tag,
    },
    {
      title: "Analytics",
      url: "/admin/dashboard/analytics",
      icon: BarChart,
    },
    {
      title: "Alerts",
      url: "/admin/dashboard/alerts",
      icon: AlertTriangle,
    },
    {
      title: "Configuration",
      url: "/admin/config",
      icon: Settings,
      subItems: [
        {
          title: "Environment Setup",
          url: "/admin/config",
        },
        {
          title: "API Key Management",
          url: "/admin/config/api-keys",
        },
        {
          title: "System Status",
          url: "/admin/config/system-status",
        },
      ],
    },
    {
      title: "Test Suite",
      url: "/test-suite",
      icon: ClipboardList,
    },
  ],
  user: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Settings",
      url: "/settings/profile",
      icon: Settings,
    },
  ],
}

const settingsItems = [
  {
    title: "Profile",
    url: "/settings/profile",
  },
  {
    title: "Account",
    url: "/settings/account",
  },
  {
    title: "Appearance",
    url: "/settings/appearance",
  },
  {
    title: "Notifications",
    url: "/settings/notifications",
  },
  {
    title: "Integrations",
    url: "/settings/integrations",
  },
  {
    title: "Git",
    url: "/settings/git",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const supabase = createBrowserClient()

  const [userRole, setUserRole] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const { data, error } = await supabase.from("users").select("role").eq("id", user.id).single()
        if (error) {
          console.error("Error fetching user role:", error)
          setUserRole("user") // Default to 'user' if role fetch fails
        } else {
          setUserRole(data?.role || "user")
        }
      } else {
        setUserRole(null)
      }
    }
    fetchUserRole()
  }, [user, supabase])

  const currentMenuItems = userRole ? menuItems[userRole as keyof typeof menuItems] : menuItems.user

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/" // Redirect to home after sign out
  }

  if (loading) {
    return (
      <Sidebar {...props}>
        <SidebarHeader>
          <SearchForm />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Loading...</SidebarGroupLabel>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentMenuItems.map((item) => (
                <React.Fragment key={item.title}>
                  {item.subItems ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={pathname.startsWith(item.url)}>
                            <item.icon />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                      </SidebarMenuItem>
                      <CollapsibleContent>
                        <SidebarMenu>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton asChild isActive={pathname === subItem.url}>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Users /> {user?.email || "Guest"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-(--radix-popper-anchor-width)">
                <DropdownMenuItem>
                  <Link href="/settings/profile" className="w-full">
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings/account" className="w-full">
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
