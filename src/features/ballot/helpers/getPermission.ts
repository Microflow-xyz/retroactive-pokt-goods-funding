import { getAppState } from "~/utils/state";

export const getPermission = (
  isAdmin?: boolean,
  isConnected?: boolean,
  address?: `0x${string}`,
  isVoter?: boolean,
) => {
  const state = getAppState();
  if (state === "VOTING")
    if (isConnected !== undefined) {
      if (isConnected)
        if (address !== undefined) if (isAdmin || isVoter) return true;
      return false;
    }
  return false;
};
