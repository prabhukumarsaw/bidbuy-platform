"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type NavigationLink = {
  icon: React.ElementType;
  title: string;
  href: string;
  children?: {
    title: string;
    href: string;
    description: string;
  }[];
};

type MegaMenuProps = {
  navigationLinks: NavigationLink[];
  handleNavigation: (href: string) => void;
};

export function MegaMenu({ navigationLinks, handleNavigation }: MegaMenuProps) {
  return (
   
    <NavigationMenu>
      <NavigationMenuList>
        {navigationLinks.map((link) => (
          <NavigationMenuItem key={link.title}>
            {link.children ? (
              <>
                <NavigationMenuTrigger className="bg-transparent text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {link.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <motion.ul
                    className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {link.children.map((child) => (
                      <ListItem
                        key={child.title}
                        title={child.title}
                        href={child.href}
                        onClick={() => handleNavigation(child.href)}
                      >
                        {child.description}
                      </ListItem>
                    ))}
                  </motion.ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={link.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-sm font-medium text-foreground hover:text-primary transition-colors"
                  )}
                  onClick={() => handleNavigation(link.href)}
                >
                  {link.title}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>

  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

