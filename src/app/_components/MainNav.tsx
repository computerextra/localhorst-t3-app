"use server";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ListItem } from "./NavItem";

export type MenuItem = {
  title: string;
  admin?: boolean;
  items: {
    title: string;
    href: string;
    desc?: string | null;
  }[];
};

const NavLinks: MenuItem[] = [
  {
    title: "Frühstück",
    admin: false,
    items: [
      {
        title: "Eingabe",
        href: "/Einkauf/Eingabe",
        desc: "Hier kann der tägliche Einkauf für das Frühstück eingegeben werden",
      },
      {
        title: "Liste",
        href: "/Einkauf",
        desc: "Die Übersicht aller Einkäufe des Tages",
      },
      {
        title: "Abrechnung",
        href: "/Einkauf/Abrechnung",
        desc: "PayPal Abrechnungen können hier getätigt werden",
      },
    ],
  },
  {
    title: "Mitarbeiter",
    admin: false,
    items: [
      {
        title: "Übersicht",
        href: "/Mitarbeiter",
        desc: "Eine Übersicht aller Mitarbeiter der CE",
      },
      {
        title: "Geburtstage",
        href: "/Mitarbeiter/Geburtstage",
        desc: "DIE Geburtstagsliste",
      },
      {
        title: "Telefonliste",
        href: "/Mitarbeiter/Telefon",
        desc: "Verfügbare Telefonnummern intern/extern",
      },
    ],
  },
  {
    title: "Internes",
    admin: false,
    items: [
      {
        title: "Archiv",
        href: "Internal/Archiv",
        desc: "Ein Nachbau des CE Archiv, da das alte im INTREXX nicht mehr funktioniert.",
      },
    ],
  },
  {
    title: "Wiki",
    admin: false,
    items: [
      {
        title: "Signaturen",
        href: "/Wiki/Signaturen",
        desc: "Eine Anleitung zum Einspielen von Signaturen in Outlook",
      },
      {
        title: "Zeiterfassung",
        href: "/Wiki/Zeiterfassung",
        desc: "Eine kurze Anleitung zur Nutzung der Zeiterfassung im INTREXX",
      },
      {
        title: "Datenschutzformulare",
        href: "/Wiki/Formulare",
        desc: "Anleitung für die neuen Datenschutzformulare MS/Apple/Google",
      },
    ],
  },
  {
    title: "Lieferanten",
    admin: false,
    items: [
      {
        title: "Lieferanten",
        href: "/Lieferanten",
        desc: "Die Lieferantenübersicht",
      },
      {
        title: "Telefonliste",
        href: "/Lieferanten/Telefonliste",
        desc: "Eine Telefonliste für Lieferanten",
      },
    ],
  },
  {
    title: "Sage",
    admin: false,
    items: [
      {
        title: "Kunden- / Lieferantensuche",
        href: "/Sage/Kunden",
        desc: "An Sage angebundene Suche für Kunden und Lieferanten",
      },
    ],
  },
  {
    title: "Service",
    admin: true,
    items: [
      {
        title: "Inventur",
        href: "/Service/Inventur",
        desc: "Übersicht der Inventuren",
      },
      {
        title: "Seriennummern",
        href: "/Servie/Seriennummern",
        desc: "CE SN konforme Formatierung von Artikeln",
      },
      {
        title: "Info",
        href: "/Service/Info",
        desc: "Mail Info an KD wenn ET abholbereit",
      },
    ],
  },
  {
    title: "Datenschutz",
    admin: true,
    items: [
      {
        title: "Datenschutz Portal",
        href: "https://dsgvo3.ds-manager.net/computerextra/home.html",
        desc: "Datenschutz Portal der CE",
      },
    ],
  },
  {
    title: "CMS",
    admin: true,
    items: [
      {
        title: "Abteilungen",
        href: "/CMS/Abteilungen",
        desc: "Verwaltung der angezeigten Abteilungen auf der CE Webseite",
      },
      {
        title: "Mitarbeiter",
        href: "/CMS/Mitarbeiter",
        desc: "Verwaltung der angezeigten Mitarbeiter auf der CE Webseite",
      },
      {
        title: "Partner",
        href: "/CMS/Partner",
        desc: "Verwaltung der angezeigten Partner auf der CE Webseite",
      },
      {
        title: "Angebote",
        href: "/CMS/Angebote",
        desc: "Verwaltung der angezeigten Angebote auf der CE Webseite",
      },
      {
        title: "Jobs",
        href: "/CMS/Jobs",
        desc: "Verwaltung der angezeigten Jobs auf der CE Webseite",
      },
    ],
  },
  {
    title: "Werkstatt",
    admin: false,
    items: [
      {
        title: "Handout",
        href: "/Werkstatt/Formulare",
        desc: "Erstellung von KD Handouts für Zugangsdaten",
      },
    ],
  },
];

export default async function MainNav() {
  const session = await auth();

  return (
    <HydrateClient>
      <div className="flex items-center justify-between bg-background px-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Local Horst
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {NavLinks.map((group) => {
              if (group.admin && session?.user.admin)
                return (
                  <NavigationMenuItem key={group.title}>
                    <NavigationMenuTrigger>{group.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[100vw] gap-3 p-4 md:grid-cols-4">
                        {group.items.map((item) => (
                          <ListItem
                            key={item.title}
                            title={item.title}
                            href={item.href}
                          >
                            {item.desc}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              if (!group.admin)
                return (
                  <NavigationMenuItem key={group.title}>
                    <NavigationMenuTrigger>{group.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[100vw] gap-3 p-4 md:grid-cols-4">
                        {group.items.map((item) => (
                          <ListItem
                            key={item.title}
                            title={item.title}
                            href={item.href}
                          >
                            {item.desc}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
            })}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.user?.image ?? ""}
                      alt={session?.user?.name ?? ""}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex-col items-start">
                  <div className="text-sm font-medium">
                    {session?.user?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session?.user?.email}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/Benutzer">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/api/auth/signout">Abmelden</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button>
              <Link href="/api/auth/signin">Anmelden</Link>
            </Button>
          )}
        </div>
      </div>
    </HydrateClient>
  );
}
