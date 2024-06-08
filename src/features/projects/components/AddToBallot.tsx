import { useState, useEffect } from "react";
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
  const [isSubmitted, setIsSubmitted] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem("transaction");
      setIsSubmitted(value);
    }
  }, []);

  console.log("localStorage?.getItem", isSubmitted);
  const { address } = useAccount();
  if (getAppState() !== "VOTING" && !isAdmin) return null;
  return (
    <div className="ml-2">
      <Button
        disabled={!address || (isSubmitted && isSubmitted?.length > 0)}
        onClick={onClick}
        variant="primary"
        className="h-auto w-full px-6 py-[0.625rem] text-sm font-medium md:w-auto"
      >
        Manage Project on Ballot
      </Button>
    </div>
  );
};
