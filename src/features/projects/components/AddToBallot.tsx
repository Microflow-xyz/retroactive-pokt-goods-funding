import { useAccount } from "wagmi";
import { useLocalStorage } from "react-use";
import { Button } from "~/components/ui/Button";
import { getAppState } from "~/utils/state";
import { getPermission } from "~/features/ballot/helpers/getPermission";
import { useIsVoter } from "~/hooks/useIsVoter";

export const ProjectAddToBallot = ({
  onClick,
  isAdmin = false,
}: {
  onClick: () => void;
  isAdmin?: boolean;
}) => {
  const [transactionId] = useLocalStorage<{
    submit?: string;
    revoke?: string;
  }>("transaction");

  const { address } = useAccount();
  const isVoter = useIsVoter();

  if (
    getAppState() !== "VOTING" ||
    !getPermission(isAdmin, true, address, isVoter)
  )
    return null;
  return (
    <div className="ml-2">
      <Button
        disabled={!address || transactionId?.submit}
        onClick={onClick}
        variant="primary"
        className="h-auto w-full px-6 py-[0.625rem] text-sm font-medium md:w-auto"
      >
        Manage Project on Ballot
      </Button>
    </div>
  );
};
