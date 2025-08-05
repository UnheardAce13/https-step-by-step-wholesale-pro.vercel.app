"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SettingsSidebarProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SettingsSidebar({ className, items, ...props }: SettingsSidebarProps) {
  const pathname = usePathname()

  return (
    <Card className={cn("lg:col-span-2", className)} {...props}>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="flex flex-col space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-muted" : "transparent",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}
