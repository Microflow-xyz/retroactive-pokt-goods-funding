import { useAccount } from "wagmi";
import { config } from "~/config";

export function useIsVoter() {
  const { address } = useAccount();
  return config.voters.includes(address!);
}