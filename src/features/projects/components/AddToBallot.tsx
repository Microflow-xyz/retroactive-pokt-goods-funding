import { useAccount } from "wagmi";
import { Button } from "~/components/ui/Button";
import { getAppState } from "~/utils/state";

export const ProjectAddToBallot = ({
  onClick,
  isAdmin = false,
}: {
  onClick: () => void;
  isAdmin?: boolean;
}) => {
  const { address } = useAccount();
  if (getAppState() !== "VOTING" && !isAdmin) return null;
  return (
    <div className="ml-2">
      <Button
        disabled={!address}
        onClick={onClick}
        variant="primary"
        className="h-auto w-full px-6 py-[0.625rem] text-sm font-medium md:w-auto"
      >
        Manage Project on Ballot
      </Button>
    </div>
  );
};
