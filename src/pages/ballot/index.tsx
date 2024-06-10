import React, { useState, useEffect } from "react";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";

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
import { useBallotWithMetadata } from "~/hooks/useBallot";
import { Skeleton } from "~/components/ui/Skeleton";
import { type Attestation } from "~/utils/fetchAttestations";
import { getPermission } from "~/features/voters/helpers/getPermission";

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

  const [draft, _, clearDraft] = useLocalStorage<ballotImpacts>("ballot-draft");
  const [transactionId, setTransactionId] = useLocalStorage<{
    submit?: string;
    revoke?: string;
  }>("transaction");
  const {
    ballotData,
    metadataData,
    isLoading: loadingBallot,
    isError,
  } = useBallotWithMetadata(address, transactionId?.submit);

  const [droppedItems, setDroppedItems] = useState<ballotImpacts>({
    lowImpactProjects: [] as projectSchema[],
    mediumImpactProjects: [] as projectSchema[],
    highImpactProjects: [] as projectSchema[],
    highestImpactProjects: [] as projectSchema[],
  });
  const [rulesCheck, setRulesCheck] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState(true);
  const [isPermitted, setIsPermitted] = useState<boolean | undefined>();
  const [userBallot, setUserBallot] = useState<{
    ballot?: Attestation;
    metadata: ballotImpacts;
  }>();

  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();

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

  useEffect(() => {
    if (submit?.data?.tx?.hash)
      setTransactionId({ submit: submit.data?.tx?.hash, revoke: undefined });
  }, [submit?.data]);

  const error = submit?.error;

  useEffect(() => {
    setIsPermitted(getPermission(isAdmin, isConnected, address));
    if (isPermitted !== undefined && isPermitted === false && !loadingBallot)
      setLoadingState(false);
  }, [isConnected, address, isAdmin, isPermitted, loadingBallot]);

  useEffect(() => {
    if (!loadingBallot)
      if (ballotData && metadataData?.data && !transactionId?.revoke) {
        setUserBallot({ ballot: ballotData, metadata: metadataData.data });
        setLoadingState(false);
      } else if (isError) {
        setUserBallot(undefined);
        setLoadingState(false);
      } else if (transactionId?.revoke) setLoadingState(false);
  }, [isError, ballotData, loadingBallot, metadataData?.data]);

  if (isModal) {
    // FIXME: This should be removed
    return (
      <DndProvider backend={HTML5Backend}>
        <BallotAllocation
          setDroppedItems={setDroppedItems}
          droppedItems={droppedItems}
          isModal
          projectName={projectName}
        />
      </DndProvider>
    );
  } else if (!isModal) {
    return (
      <Layout isFullWidth>
        <Skeleton
          className="min-h  mb-1 h-40 w-full bg-slate-300"
          isLoading={loadingState}
        >
          {(() => {
            if (isPermitted === false) {
              return (
                <div className="mt-20 flex w-full flex-col items-center justify-between gap-10">
                  <span className=" flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFB3B2] bg-opacity-40">
                    <X color="#FFB3B2" strokeWidth={4} className=" h-9 w-9" />
                  </span>
                  <p className="flex max-w-[40%] flex-col items-center gap-3 text-center text-xl font-bold text-onPrimary-light">
                    You don't have the permission to view this section.
                    <span className=" text-sm font-normal text-primaryContainer-light">
                      Please connect your authorized wallet or contact us
                      through <b>help desk</b> to ask for further help if you
                      think there is a mistake here.
                    </span>
                  </p>
                </div>
              );
            }

            if (userBallot) {
              return (
                <DndProvider backend={HTML5Backend}>
                  <BallotRevocation
                    ballot={{
                      time: userBallot.ballot?.time,
                      id: userBallot.ballot?.id,
                      data: userBallot.metadata,
                    }}
                    clearTransaction={(id: string) => {
                      setTransactionId({
                        submit: undefined,
                        revoke: id,
                      });
                      setUserBallot(undefined);
                    }}
                  />
                </DndProvider>
              );
            }
            if (!userBallot)
              if (transactionId?.submit)
                return (
                  <div className="mt-20 flex flex-col items-center gap-3">
                    <p className="flex items-center font-bold">
                      "We have received your ballot."
                    </p>
                    <span className="text-sm font-normal text-[#C6E7FF]">
                      "Your ballot status can take 10 minutes to be updated.
                    </span>
                  </div>
                );
              else
                return (
                  <DndProvider backend={HTML5Backend}>
                    {error && <p></p>}
                    <div className=" flex items-center justify-between gap-3 rounded-2xl bg-onBackground-dark px-6 py-4 text-sm font-normal text-secondary-dark">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-dark bg-opacity-40">
                        i
                      </span>
                      <p className=" w-fit">
                        Be mindful not to vote for a project if you have a
                        direct financial interest in the project (as an
                        employee, contractor, or equity holder) or the project
                        has asked you to vote for them. These may lead to the
                        project being disqualified. (
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
                      <RainbowConnectButton.Custom>
                        {({ chain, mounted }) => {
                          return (
                            <div
                              className="flex flex-col items-end"
                              {...(!mounted && {
                                "aria-hidden": true,
                                style: {
                                  opacity: 0,
                                  pointerEvents: "none",
                                  userSelect: "none",
                                },
                              })}
                            >
                              {(() => {
                                return (
                                  <>
                                    <Button
                                      disabled={
                                        submit.isPending ||
                                        Object.values(droppedItems).flat()
                                          .length === 0 ||
                                        rulesCheck ||
                                        !isConnected ||
                                        chain?.unsupported
                                      }
                                      variant="primary"
                                      className="w-fit"
                                      type="submit"
                                      isLoading={submit?.isPending}
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
                                    {(chain?.unsupported ||
                                      !isCorrectNetwork) && (
                                      <p className="mt-2 flex flex-col items-end text-xs">
                                        Wrong network
                                        <span>
                                          You must be connected to
                                          {correctNetwork.name}
                                        </span>
                                      </p>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          );
                        }}
                      </RainbowConnectButton.Custom>
                    </div>
                  </DndProvider>
                );
            if (submit.isSuccess)
              return (
                <div className="mt-20 flex w-full flex-col items-center justify-between gap-10">
                  <span className=" flex h-20 w-20 items-center justify-center rounded-full bg-[#00BF4D] bg-opacity-40">
                    <Check
                      strokeWidth={4}
                      className=" h-9 w-9"
                      color="#00BF4D"
                    />
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
              );

            return <div className="h-40" />;
          })()}
        </Skeleton>
      </Layout>
    );
  }
}
