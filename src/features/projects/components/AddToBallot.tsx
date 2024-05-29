import { useState } from "react";
import { z } from "zod";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { useFormContext } from "react-hook-form";
import { Check } from "lucide-react";

import { Button, IconButton } from "~/components/ui/Button";
import { formatNumber } from "~/utils/formatNumber";
import { Dialog } from "~/components/ui/Dialog";
import { Form } from "~/components/ui/Form";
import {
  ballotContains,
  useAddToBallot,
  useBallot,
  useRemoveFromBallot,
  sumBallot,
} from "~/features/ballot-/hooks/useBallot";
import { AllocationInput } from "~/components/AllocationInput";
import { config } from "~/config";
import { getAppState } from "~/utils/state";
// FIXME: remove direct page import here
import Ballot from "~/pages/ballot";

type Props = { id?: string; name?: string };

export const ProjectAddToBallot = ({ id, name }: Props) => {
  const { address } = useAccount();
  const [isOpen, setOpen] = useState(false);
  const add = useAddToBallot();
  const remove = useRemoveFromBallot();
  const { data: ballot } = useBallot();

  const inBallot = ballotContains(id!, ballot);
  const allocations = ballot?.votes ?? [];
  const sum = sumBallot(allocations.filter((p) => p.projectId !== id));
  if (getAppState() !== "VOTING") return null;
  return (
    <div>
      {ballot?.publishedAt ? (
        <Button disabled>Ballot published</Button>
      ) : inBallot ? (
        <IconButton
          onClick={() => setOpen(true)}
          variant="primary"
          icon={Check}
        >
          {/* FIXME: Remove This */}
          {/* {formatNumber(inBallot.amount)} allocated */}
          Add to ballot
        </IconButton>
      ) : (
        <Button
          disabled={!address}
          onClick={() => setOpen(true)}
          variant="primary"
          className="w-full md:w-auto"
        >
          Add to ballot
        </Button>
      )}
      <Dialog size="md" isOpen={isOpen} onOpenChange={setOpen} title={`Ballot`}>
        {/* FIXME: Ballot Page should be refactored here also modify the name */}
        <Ballot isModal />
      </Dialog>
    </div>
  );
};

const ProjectAllocation = ({
  current = 0,
  inBallot,
  onRemove,
}: {
  current: number;
  inBallot: boolean;
  onRemove: () => void;
}) => {
  const form = useFormContext();
  const formAmount = form.watch("amount") as string;
  const amount = formAmount
    ? parseFloat(String(formAmount).replace(/,/g, ""))
    : 0;
  const total = amount + current;

  const exceededProjectTokens = amount > config.votingMaxProject;
  const exceededMaxTokens = total > config.votingMaxTotal;

  const isError = exceededProjectTokens || exceededMaxTokens;
  return (
    <div>
      <AllocationInput error={isError} name="amount" />
      <div className="flex justify-between gap-2 pt-2 text-sm">
        <div className="flex gap-2">
          <span className="text-gray-600 dark:text-gray-400">
            Total allocated:
          </span>
          <span
            className={clsx("font-semibold", {
              ["text-primary-500"]: exceededMaxTokens,
            })}
          >
            {formatNumber(total)}
          </span>
        </div>
        <div className="flex gap-2">
          <span
            className={clsx("font-semibold", {
              ["text-primary-500"]: exceededProjectTokens,
            })}
          >
            {formatNumber(amount)}
          </span>
          <span className="text-gray-600 dark:text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-400">
            {formatNumber(config.votingMaxProject)}
          </span>
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <Button
          variant="primary"
          type="submit"
          className="w-full"
          disabled={isError}
        >
          {inBallot ? "Update" : "Add"} votes
        </Button>
        {inBallot ? (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onRemove}
          >
            Remove from ballot
          </Button>
        ) : null}
      </div>
    </div>
  );
};
