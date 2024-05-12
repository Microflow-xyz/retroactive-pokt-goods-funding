import { type Address } from "viem";
import { api } from "~/utils/api";
import { useMetadata } from "./useMetadata";

export function useProfile(id?: Address) {
  return api.profile.get.useQuery({ id: String(id) }, { enabled: Boolean(id) });
}

export function useProfileWithMetadata(id?: Address) {
  const profile = useProfile(id);

  return useMetadata<{
    profileImageUrl: string;
    bannerImageUrl: string;
    name: string;
  }>(profile.data?.metadataPtr);
}
