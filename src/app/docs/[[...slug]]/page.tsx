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
  
  const page = allPages.find((p: any) => {
    const pageSlug = p.slugs.join("/");
    const requestedSlug = slug.join("/");
    return pageSlug === requestedSlug || (requestedSlug === "" && pageSlug === "index");
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
  return allPages.map((page: any) => ({
    slug: page.slugs,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug || [];
  
  const allPages = (source as any).pages || [];
  
  const page = allPages.find((p: any) => {
    const pageSlug = p.slugs.join("/");
    const requestedSlug = slug.join("/");
    return pageSlug === requestedSlug || (requestedSlug === "" && pageSlug === "index");
  });

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
