import { type GetServerSideProps } from "next";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

import { Layout } from "~/layouts/DefaultLayout";
import ProjectDetails from "~/features/projects/components/ProjectDetails";
import {
  useProjectById,
  useProjectsIds,
} from "~/features/projects/hooks/useProjects";
import { ProjectAddToBallot } from "~/features/projects/components/AddToBallot";
import { NextProjectButton } from "~/features/projects/components/NextProjectButton";
import { getAppState } from "~/utils/state";
import { ProjectAwarded } from "~/features/projects/components/ProjectAwarded";
import { DiscussionComponent } from "~/features/projects/components/discussion";
import { useIsAdmin } from "~/hooks/useIsAdmin";
import { useProjectMetadata } from "~/features/projects/hooks/useProjects";
import { Dialog } from "~/components/ui/Dialog";
// FIXME: remove direct page import here
import Ballot from "~/pages/ballot";

export default function ProjectDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);
  const { address } = useAccount();
  const state = getAppState();
  const isAdmin = useIsAdmin();
  const metadata = useProjectMetadata(project?.data?.metadataPtr);
  const [isOpen, setOpen] = useState(false);
  const ids = useProjectsIds();
  const [nextProjectId, setNextProjectId] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!ids.isLoading) {
      const idsArray = ids.data;
      if (idsArray && idsArray.length > 0) {
        const currentIndex = idsArray.indexOf(projectId);
        const nextIndex = currentIndex + 1;
        const nextId = idsArray[nextIndex];
        setNextProjectId(nextId);
      }
    }
  }, [ids, projectId]);

  const action =
    state === "RESULTS" ? (
      <ProjectAwarded id={projectId} />
    ) : (
      <ProjectAddToBallot isAdmin={isAdmin} onClick={() => setOpen(true)} />
    );

  return (
    <Layout
      stickyElement={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="max-w-[75%] truncate text-2xl font-bold">
              {project?.data?.name}
            </h1>
            {metadata?.data?.impactCategory && (
              <span className=" rounded-lg bg-gray-200 px-2 py-1 text-sm font-medium transition dark:border dark:border-outline-dark dark:bg-transparent dark:text-onSurface-dark">
                {metadata?.data?.impactCategory}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {action}
            {nextProjectId ? (
              <NextProjectButton
                isAdmin={isAdmin}
                nextProjectId={nextProjectId}
              />
            ) : null}
          </div>
        </div>
      }
    >
      <ProjectDetails
        projectMetadata={metadata?.data}
        isLoading={metadata?.isPending}
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
      <Dialog size="md" isOpen={isOpen} onOpenChange={setOpen} title={`Ballot`}>
        {/* FIXME: Ballot Page should be refactored here also modify the name */}
        <Ballot projectName={project?.data?.name} isModal />
      </Dialog>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
