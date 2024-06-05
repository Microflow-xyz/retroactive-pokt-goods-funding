import { type GetServerSideProps } from "next";
import { useAccount } from "wagmi";

import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import ApproveButton from "~/features/applications/components/ApproveButton";
import { Layout } from "~/layouts/DefaultLayout";
import { useProjectMetadata } from "~/features/projects/hooks/useProjects";
import { getAppState } from "~/utils/state";
import { useIsAdmin } from "~/hooks/useIsAdmin";

export default function ApplicationDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);
  const metadata = useProjectMetadata(project?.data?.metadataPtr);
  const { address } = useAccount();
  const state = getAppState();
  const isAdmin = useIsAdmin();

  return (
    <Layout title={project.data?.name}>
      <ProjectDetails
        projectMetadata={metadata?.data}
        isLoading={metadata?.isPending}
        attestation={project.data}
        action={<ApproveButton projectIds={[projectId]} />}
        isAdmin={isAdmin}
        address={address}
        state={state}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
