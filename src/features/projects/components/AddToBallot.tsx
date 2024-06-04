import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";
import { getAppState } from "~/utils/state";
// FIXME: remove direct page import here
import Ballot from "~/pages/ballot";

type Props = { id?: string; name?: string };

export const ProjectAddToBallot = ({ id, name }: Props) => {
  const { address } = useAccount();
  const [isOpen, setOpen] = useState(false);
  if (getAppState() !== "VOTING") return null;
  return (
    <div>
      <Button
        disabled={!address}
        onClick={() => setOpen(true)}
        variant="primary"
        className="w-full md:w-auto"
      >
        Add to ballot
      </Button>

      <Dialog size="md" isOpen={isOpen} onOpenChange={setOpen} title={`Ballot`}>
        {/* FIXME: Ballot Page should be refactored here also modify the name */}
        <Ballot isModal />
      </Dialog>
    </div>
  );
};
