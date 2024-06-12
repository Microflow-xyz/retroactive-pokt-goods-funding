import { useIsVoter } from "~/hooks/useIsVoter";

export const getPermission = (
  isAdmin?: boolean,
  isConnected?: boolean,
  address?: `0x${string}`,
) => {
  const isVoter = useIsVoter();

  if (isConnected !== undefined) {
    if (isConnected)
      if (address !== undefined) if (isAdmin || isVoter) return true;
    return false;
  }
};
