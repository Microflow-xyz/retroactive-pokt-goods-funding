import { useAccount } from "wagmi";
import { config } from "~/config";

export function useIsAdmin() {
  const { address } = useAccount();
  const admins = config?.admins?.map((admin) => admin?.toLowerCase());
  return admins?.includes(address?.toLowerCase() as `0x${string}`);
}
