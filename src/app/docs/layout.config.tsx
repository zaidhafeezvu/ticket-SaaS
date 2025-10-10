/* eslint-disable @typescript-eslint/no-explicit-any */
import { source } from "./source";
import type { DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { BookOpenIcon, HomeIcon } from "lucide-react";

export const docsOptions: DocsLayoutProps = {
  tree: (source as any).pageTree,
  nav: {
    title: (
      <>
        <span className="font-bold">🎫 Ticket SaaS</span>
        <span className="text-sm text-muted-foreground ml-2">Docs</span>
      </>
    ),
    url: "/",
  },
  links: [
    {
      text: "Home",
      url: "/",
      icon: <HomeIcon />,
    },
    {
      text: "Documentation",
      url: "/docs",
      icon: <BookOpenIcon />,
      active: "nested-url",
    },
  ],
};
