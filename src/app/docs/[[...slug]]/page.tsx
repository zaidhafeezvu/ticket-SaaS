/* eslint-disable @typescript-eslint/no-explicit-any */
import { source } from "../source";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const slug = params.slug || [];
  
  const allPages = (source as any).pages || [];
  
  // Match the page by comparing slugs
  // Empty slug array matches "index"
  const page = allPages.find((p: any) => {
    if (slug.length === 0) {
      // No slug means we want the index page
      return p.slugs.length === 1 && p.slugs[0] === "index";
    }
    
    // Compare slug arrays
    if (p.slugs.length !== slug.length) return false;
    return p.slugs.every((s: string, i: number) => s === slug[i]);
  });

  if (!page) notFound();

  const pageData = page.data as any;
  const MDX = pageData.exports.default;

  return (
    <DocsPage
      toc={pageData.toc}
      lastUpdate={pageData.lastModified}
      full={pageData.full}
    >
      <DocsBody>
        <h1>{pageData.title}</h1>
        {pageData.description && (
          <p className="text-lg text-muted-foreground mb-8">
            {pageData.description}
          </p>
        )}
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const allPages = (source as any).pages || [];
  return allPages.map((page: any) => {
    // For index page, return empty slug array
    if (page.slugs.length === 1 && page.slugs[0] === "index") {
      return { slug: [] };
    }
    // For other pages, return their slugs
    return { slug: page.slugs };
  });
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug || [];
  
  const allPages = (source as any).pages || [];
  
  const page = allPages.find((p: any) => {
    if (slug.length === 0) {
      return p.slugs.length === 1 && p.slugs[0] === "index";
    }
    
    if (p.slugs.length !== slug.length) return false;
    return p.slugs.every((s: string, i: number) => s === slug[i]);
  });

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
