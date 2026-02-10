"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CookieProvider } from "@/components/cookie-provider";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageToggle } from "./LanguageToggle";
import { ModeToggle } from "./ModeToggle";

const XYLVIR_LIGHT_SUBNAV = [
  { title: "Home", href: "/" },
  { title: "Motivation", href: "/#motivation" },
  { title: "Features", href: "/#features" },
  { title: "FAQ", href: "/#faq" },
];

const NAV_LINKS = [
  { title: "Pricing", href: "/pricing" },
  { title: "Refund", href: "/refund" },
  { title: "Terms", href: "/terms" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const hash = href.split("#")[1];
    if (!hash) return;

    if (pathname === "/") {
      e.preventDefault();
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      e.preventDefault();
      router.push(href);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  /* ─── Mobile nav ─── */
  if (isMobile) {
    return (
      <CookieProvider>
        <nav className="flex items-center justify-between w-full px-4 py-3">
          <Link href="/" aria-label="Go to homepage">
            <h6>XYLVIR LIGHT</h6>
          </Link>

          <div className="flex items-center gap-px">
            <LanguageToggle />
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="right" className="w-72 pt-12">
              <SheetHeader>
                <SheetTitle>
                  <h6>XYLVIR LIGHT</h6>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-4">
                {XYLVIR_LIGHT_SUBNAV.map((item) => (
                  <SheetClose asChild key={item.title}>
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        handleAnchorClick(e, item.href);
                        setMobileOpen(false);
                      }}
                      className="px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                ))}
              </div>

              <Separator className="mx-4" />

              <div className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((item) => (
                  <SheetClose asChild key={item.title}>
                    <Link
                      href={item.href}
                      className="px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                ))}
              </div>

              <Separator className="mx-4" />

              <div className="px-4">
                <SheetClose asChild>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/login">Sign in</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </CookieProvider>
    );
  }

  /* ─── Desktop nav ─── */
  return (
    <CookieProvider>
      <NavigationMenu className="flex justify-between items-center w-full max-w-7xl sticky top-0 z-999 shrink-0">
        <NavigationMenuList className="flex-wrap flex-1 relative">
          {/* XYLVIR LIGHT with sub-navigation */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <h6>XYLVIR LIGHT</h6>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="flex gap-1 flex-1 min-w-7xl absolute top-0 left-0">
              {XYLVIR_LIGHT_SUBNAV.map((item) => (
                <NavigationMenuLink asChild key={item.title} className="flex-1">
                  <Link
                    href={item.href}
                    onClick={(e) => handleAnchorClick(e, item.href)}
                    className="group/item flex-row flex-1 items-center gap-3 text-nowrap py-20 justify-center"
                  >
                    <div className="w-px h-4 group-hover/item:bg-primary bg-transparent transition-colors duration-300" />
                    <h6>{item.title}</h6>
                    <div className="w-px h-4 group-hover/item:bg-primary bg-transparent transition-colors duration-300" />
                  </Link>
                </NavigationMenuLink>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Top-level links */}
          {NAV_LINKS.map((item) => (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href={item.href}>
                  <h6>{item.title}</h6>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>

        <div className="flex items-center gap-px">
          <LanguageToggle />
          <ModeToggle />
        </div>
      </NavigationMenu>
    </CookieProvider>
  );
}
