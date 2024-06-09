import React, { useState, useEffect } from "react";
import { Skeleton } from "~/components/ui/Skeleton";
import { formatDate } from "~/utils/time";
import { type ballotImpacts } from "~/features/ballot/types";
import DropTargetAccordion from "../ballotAllocation/DropTargetAccordion";
import { Button } from "~/components/ui/Button";
import { ConfirmDialog } from "./ConfirmDialog";
import { useRevoke } from "~/hooks/useEAS";
import { eas } from "~/config";
import { Check } from "lucide-react";

const BallotRevocation = ({
  ballot,
  clearTransaction,
}: {
  ballot: { time?: number; id: string; data: ballotImpacts };
  clearTransaction: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    mutate: revokeAttestation,
    isSuccess,
    isPending: revocationPending,
    data,
  } = useRevoke();

  useEffect(() => {
    if (isSuccess) {
      clearTransaction();
    }
  }, [isSuccess, data, clearTransaction]);

  if (isSuccess)
    return (
      <div className="mt-20 flex w-full flex-col items-center justify-between gap-10">
        <span className=" flex h-20 w-20 items-center justify-center rounded-full bg-[#00BF4D] bg-opacity-40">
          <Check strokeWidth={4} className=" h-9 w-9" color="#00BF4D" />
        </span>
        <p className="flex flex-col items-center gap-3 text-xl font-bold text-onPrimary-light">
          Your ballot revoked successfully.
          <span className="text-sm font-normal text-[#C6E7FF]">
            Your ballot status can take 10 minutes to be updated.
          </span>
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="primary"
          className="w-fit"
        >
          Continue
        </Button>
      </div>
    );
  return (
    <div className="flex w-full flex-col items-center justify-between gap-16 px-3 py-20">
      <div className="flex flex-col items-center gap-2 text-lg text-onSurfaceVariant-dark">
        <p className="flex items-center font-bold">
          Your vote was successfully submitted on &nbsp;
          {ballot?.time && <span>{formatDate(ballot.time * 1000)}.</span>}
        </p>
        <span className="text-sm font-normal text-[#C6E7FF]">
          You can review your submitted reviews and revoke them if you wish.
        </span>
      </div>

      <div className="flex w-full flex-col gap-3">
        <h3 className="text-base font-semibold">Tiers</h3>
        <div className=" rounded-xl border border-outline-dark bg-onBackground-dark">
          <DropTargetAccordion
            shelveName="highestImpactProjects"
            label={`Highest Impact`}
            droppedItems={ballot?.data}
            className="border-b border-outline-dark"
          />

          <DropTargetAccordion
            shelveName="highImpactProjects"
            label={`High Impact`}
            droppedItems={ballot?.data}
            className="border-b border-outline-dark"
          />

          <DropTargetAccordion
            shelveName="mediumImpactProjects"
            label={`Medium Impact`}
            droppedItems={ballot?.data}
            className="border-b border-outline-dark"
          />

          <DropTargetAccordion
            shelveName="lowImpactProjects"
            label={`Low Impact`}
            droppedItems={ballot?.data}
          />
        </div>
      </div>
      <Button
        variant="outline"
        className="h-10 w-fit px-6 text-sm font-medium"
        onClick={() => setIsOpen(true)}
      >
        Revoke Ballot
      </Button>
      {isOpen && (
        <ConfirmDialog
          onSubmit={() =>
            revokeAttestation({
              schema: eas.schemas.metadata,
              uid: ballot?.id,
            })
          }
          isLoading={revocationPending}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </div>
  );
};

export default BallotRevocation;
