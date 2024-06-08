import React, { useState, useEffect } from "react";
import { useLocalStorage } from "react-use";
import Link from "next/link";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Check, X } from "lucide-react";
import { Layout } from "~/layouts/DefaultLayout";
import BallotAllocation from "~/features/ballot/ballotAllocation";
import BallotRevocation from "~/features/ballot/ballotRevocation";
import Rules from "~/features/ballot/Rules";
import {
  BallotImpactsSchema,
  type ballotImpacts,
  type projectSchema,
} from "~/features/ballot/types";
import { useSubmitBallot } from "~/features/ballot/hooks/useSubmitBallot";
import { Button } from "~/components/ui/Button";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { useIsAdmin } from "~/hooks/useIsAdmin";
import { config } from "~/config";
import { useBallotWithMetadata } from "~/hooks/useBallot";

//FIXME: Ballot Page props should be removed
export default function Ballot({
  isModal = false,
  projectName,
}: {
  isModal?: boolean;
  projectName?: string;
}) {
  const { isConnected, address } = useAccount();
  const isAdmin = useIsAdmin();
  const {
    ballotData,
    metadataData,
    refetchBallot,
    isLoading: loadingBallot,
    isError,
  } = useBallotWithMetadata(address);
  const [draft, _, clearDraft] = useLocalStorage<ballotImpacts>("ballot-draft");
  const [droppedItems, setDroppedItems] = useState<ballotImpacts>({
    lowImpactProjects: [] as projectSchema[],
    mediumImpactProjects: [] as projectSchema[],
    highImpactProjects: [] as projectSchema[],
    highestImpactProjects: [] as projectSchema[],
  });

  const [rulesCheck, setRulesCheck] = useState<string[]>([]);
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();

  console.log("ballot", isError);

  useEffect(() => {
    setDroppedItems({
      lowImpactProjects: draft?.lowImpactProjects ?? [],
      mediumImpactProjects: draft?.mediumImpactProjects ?? [],
      highImpactProjects: draft?.highImpactProjects ?? [],
      highestImpactProjects: draft?.highestImpactProjects ?? [],
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("ballot-draft", JSON.stringify(droppedItems));
    setRulesCheck(
      BallotImpactsSchema?.safeParse(droppedItems)?.error?.errors?.map(
        (error) => error?.path[0],
      ),
    );
  }, [droppedItems]);

  const submit = useSubmitBallot({
    onSuccess: () => {
      toast.success("Ballot submitted successfully!");
      clearDraft();
    },
    onError: (err: { reason?: string; data?: { message: string } }) => {
      toast.error("An error occurred submitting your ballot. ", {
        description:
          err.reason ??
          err.data?.message ??
          (!isCorrectNetwork &&
            `You must be connected to ${correctNetwork.name}`) ??
          (!isConnected && (
            <div>You must connect wallet to submit a ballot</div>
          )),
      });
    },
  });

  const error = submit.error;

  if (
    !isConnected ||
    (!isAdmin && address && !config.voters.includes(address))
  ) {
    return (
      <Layout isFullWidth>
        <div className="mt-20 flex w-full flex-col items-center justify-between gap-10">
          <span className=" flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFB3B2] bg-opacity-40">
            <X color="#FFB3B2" strokeWidth={4} className=" h-9 w-9" />
          </span>
          <p className="flex max-w-[40%] flex-col items-center gap-3 text-center text-xl font-bold text-onPrimary-light">
            You don't have the permission to view this section.
            <span className=" text-sm font-normal text-primaryContainer-light">
              Please connect your authorized wallet or contact us through{" "}
              <b>help desk</b> to ask for further help if you think there is a
              mistake here.
            </span>
          </p>
        </div>
      </Layout>
    );
  }

  if (submit.isSuccess) {
    return (
      <Layout isFullWidth>
        <div className="mt-20 flex w-full flex-col items-center justify-between gap-10">
          <span className=" flex h-20 w-20 items-center justify-center rounded-full bg-[#00BF4D] bg-opacity-40">
            <Check strokeWidth={4} className=" h-9 w-9" color="#00BF4D" />
          </span>
          <p className="flex flex-col items-center gap-3 text-xl font-bold text-onPrimary-light">
            Your ballot submitted successfully.
            <span className=" text-sm font-normal text-primaryContainer-light">
              You can revoke your vote later.
            </span>
          </p>
          <Button
            variant="primary"
            className="w-fit"
            onClick={() => window.location.reload()}
          >
            Continue
          </Button>
        </div>
      </Layout>
    );
  }

  if (!isModal && metadataData?.data) {
    return (
      <Layout isFullWidth>
        <DndProvider backend={HTML5Backend}>
          <BallotRevocation
            ballot={{
              time: ballotData?.time,
              id: ballotData?.id,
              data: metadataData.data,
            }}
            isPending={loadingBallot}
          />
        </DndProvider>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout isFullWidth>
        <DndProvider backend={HTML5Backend}>
          {error && <p></p>}
          <div className=" flex items-center justify-between gap-3 rounded-2xl bg-onBackground-dark px-6 py-4 text-sm font-normal text-secondary-dark">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-dark bg-opacity-40">
              i
            </span>
            <p className=" w-fit">
              Be mindful not to vote for a project if you have a direct
              financial interest in the project (as an employee, contractor, or
              equity holder) or the project has asked you to vote for them.
              These may lead to the project being disqualified. (
              <Link
                className=" underline"
                target="_blank"
                href="https://docs.pokt.network/community/retro-pokt-goods-funding/rules-of-conduct"
              >
                Learn more
              </Link>
              )
            </p>
          </div>
          <Rules rulesCheck={rulesCheck} />
          <BallotAllocation
            setDroppedItems={setDroppedItems}
            droppedItems={droppedItems}
            isModal={isModal}
          />
          <div className="mt-5 flex justify-end">
            <Button
              disabled={
                Object.values(droppedItems).flat().length === 0 ||
                rulesCheck ||
                !isConnected
              }
              variant="primary"
              className="w-fit"
              type="submit"
              isLoading={submit.isPending}
              onClick={async () => {
                submit.mutate({
                  impacts: droppedItems,
                });
              }}
            >
              {submit?.isUploading
                ? "Uploading metadata"
                : submit?.isAttesting
                  ? "Creating Ballot"
                  : "Submit Ballot"}
            </Button>
          </div>
        </DndProvider>
      </Layout>
    );
  }

  return <Layout isFullWidth></Layout>;
}
