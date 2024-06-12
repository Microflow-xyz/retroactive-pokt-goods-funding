import { useAccount } from "wagmi";
import { config } from "~/config";

export function useIsVoter() {
  const { address } = useAccount();
  return config.voters?.some(
    (item) => item?.toLowerCase() === address?.toLowerCase(),
  );
}
