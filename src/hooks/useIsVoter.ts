import { useAccount } from "wagmi";
import { config } from "~/config";

export function useIsVoter() {
  const { address } = useAccount();
  const voters = config?.voters?.map((voter) => voter?.toLowerCase());
    return voters?.includes(address?.toLowerCase() as `0x${string}`);
}
