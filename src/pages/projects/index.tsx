import { LayoutWithBallot } from "~/layouts/DefaultLayout";
import { Projects } from "~/features/projects/components/Projects";

export default function ProjectsPage() {
  return (
    <LayoutWithBallot eligibilityCheck showBallot>
      <Projects />
    </LayoutWithBallot>
  );
}
