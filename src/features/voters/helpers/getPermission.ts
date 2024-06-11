import { config } from "~/config";

export const getPermission = (
  isAdmin?: boolean,
  isConnected?: boolean,
  address?: `0x${string}`,
) => {
  if (isConnected !== undefined) {
    if (isConnected)
      if (address !== undefined)
        if (
          isAdmin ||
          config.voters?.some(
            (item) => item.toLowerCase() === address.toLowerCase(),
          )
        )
          return true;
    return false;
  }
};
