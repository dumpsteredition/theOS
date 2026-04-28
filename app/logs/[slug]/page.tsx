import { notFound } from "next/navigation";

import { LogDetailView } from "@/components/sections/log-detail-view";
import { getLogBySlug, systemLogs } from "@/data/site-content";

export function generateStaticParams() {
  return systemLogs.map((log) => ({ slug: log.slug }));
}

export default async function LogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!getLogBySlug(slug)) {
    notFound();
  }

  return <LogDetailView slug={slug} />;
}
