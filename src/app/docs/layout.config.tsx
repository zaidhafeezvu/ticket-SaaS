/* eslint-disable @typescript-eslint/no-explicit-any */
import { source } from "./source";
import type { DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { BookOpenIcon, HomeIcon } from "lucide-react";

// Build a simple page tree from the docs
const buildPageTree = () => {
  const pages = (source as any).pages || [];
  return {
    name: "Docs",
    children: pages.map((page: any) => ({
      name: page.data.title,
      url: `/docs/${page.slugs.join("/")}`,
      ...page,
    })),
  };
};

export const docsOptions: DocsLayoutProps = {
  tree: buildPageTree(),
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
