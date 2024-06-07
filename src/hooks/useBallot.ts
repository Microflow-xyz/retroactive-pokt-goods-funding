import { type Address } from "viem";
import { api } from "~/utils/api";
import { useMetadata } from "./useMetadata";
import { type ballotImpacts } from "~/features/ballot/types";
import { metadata } from "~/config";

export function useBallot(id?: Address) {
  return api.ballot.get.useQuery({ id: String(id) }, { enabled: Boolean(id) });
}

export function useBallotWithMetadata(id?: Address) {
  const ballot = useBallot(id);

  return {
    ballotData: { ...ballot.data },
    metadataData: useMetadata<ballotImpacts>(ballot.data?.metadataPtr),
  };
}
