"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { categories } from "@/assets/navigation-data"

export function CategoryNav() {
  return (
    <div className={cn("border-t")}>
      <ScrollArea className="w-full">
        <div className="flex items-center space-x-4 px-4 overflow-x-auto whitespace-nowrap bg-secondary dark:bg-secondary py-2">
          <NavigationMenu className="max-w-none">
            <NavigationMenuList className="flex">
              {categories.map((category) => (
                <NavigationMenuItem key={category.title} className="flex-shrink-0">
                  <Link href={`/category/${category.title.toLowerCase()}`} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "h-8 px-3 lg:px-4 text-foreground text-sm font-semibold transition-colors rounded-3xl"
                    )}>
                      <category.icon className="w-4 h-4 mr-2" />
                      {category.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}

