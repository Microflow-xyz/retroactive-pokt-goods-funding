import React from "react";
import { config } from "~/config";
import { type Attestation } from "~/utils/fetchAttestations";
import { type AppState } from "~/utils/state";
import { Skeleton } from "~/components/ui/Skeleton";
import { CreateNew } from "./CreateNew";
import { List } from "./list";
import { useGetDiscussions } from "../../hooks/useDiscussion";
import type { Discussion } from "~/features/projects/types/discussion";

export const DiscussionComponent = ({
  address,
  state,
  projectId,
  isAdmin = false,
}: {
  address: `0x${string}` | undefined;
  state: AppState;
  projectId: string;
  isAdmin: boolean;
}) => {
  const voters = config?.voters;
  const { data, refetch, isLoading } = useGetDiscussions({
    projectId: projectId,
  });
  return (
    <div className="mt-10 flex flex-col items-baseline gap-5 border-t border-outlineVariant-dark pt-10">
      <div className=" text-lg font-bold text-onSurface-dark">Discussions</div>

      {isAdmin || voters?.some((item) => item === address) ? (
        <>
          <CreateNew onRefetch={() => refetch()} projectId={projectId} />
          <Skeleton className="mb-1 min-h-24 w-full" isLoading={isLoading}>
            {data && (
              <List
                projectId={projectId}
                discussions={data as Discussion[]}
                onRefetch={() => refetch()}
              />
            )}
          </Skeleton>
        </>
      ) : (
        <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-outlineVariant-dark bg-surfaceContainerLow-dark py-7 text-onSurfaceVariant-dark">
          <p className="text-base font-semibold">
            Creating project period is finished
          </p>
          <span className="text-xs font-normal">
            View discussions is only available for the voters
          </span>
        </div>
      )}
    </div>
  );
};
