import { ProjectCaseClient } from "./app/projects/[slug]/case-client";
import { getProject } from "./projects";

export default function CaseApp({ slug }: { slug: string }) {
  const project = getProject(slug);

  if (!project) {
    return (
      <main className="route-error">
        <p>404</p>
        <h1>Project not found</h1>
        <a href="/">Back to Andrian.Dev</a>
      </main>
    );
  }

  return <ProjectCaseClient project={project} />;
}
