import { type GetServerSideProps } from "next";
import { useAccount } from "wagmi";

import { LayoutWithBallot } from "~/layouts/DefaultLayout";
import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { ProjectAddToBallot } from "~/features/projects/components/AddToBallot";
import { getAppState } from "~/utils/state";
import { ProjectAwarded } from "~/features/projects/components/ProjectAwarded";
import { DiscussionComponent } from "~/features/projects/components/discussion";
import { useIsAdmin } from "~/hooks/useIsAdmin";

export default function ProjectDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);
  const { name } = project.data ?? {};
  const { address } = useAccount();
  const state = getAppState();
  const isAdmin = useIsAdmin();

  const action =
    state === "RESULTS" ? (
      <ProjectAwarded id={projectId} />
    ) : (
      <ProjectAddToBallot id={projectId} name={name} />
    );
  return (
    <LayoutWithBallot title={name} showBallot eligibilityCheck>
      <ProjectDetails
        isAdmin={isAdmin}
        address={address}
        attestation={project.data}
        action={action}
        state={state}
      />
      <DiscussionComponent
        projectId={projectId}
        state={state}
        address={address}
        isAdmin={isAdmin}
      />
    </LayoutWithBallot>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
