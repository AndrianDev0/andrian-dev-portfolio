import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "../../../projects";
import { absoluteAlternates, findIndexableRoute, projectRoutePath } from "../../../site-registry";
import { ProjectCaseClient } from "./case-client";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = findIndexableRoute(projectRoutePath(slug, "ru"));
  if (!route || route.kind !== "project") return {};
  const alternates = absoluteAlternates(route.alternates);
  return {
    title: { absolute: route.metadata.title },
    description: route.metadata.description,
    alternates: {
      canonical: route.path,
      languages: alternates ? { ru: alternates.ru, en: alternates.en, "x-default": alternates.xDefault } : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectCaseClient project={project} />;
}
