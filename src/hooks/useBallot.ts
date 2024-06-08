import { type Address } from "viem";
import { api } from "~/utils/api";
import { useMetadata } from "./useMetadata";
import { type ballotImpacts } from "~/features/ballot/types";
import { metadata } from "~/config";

export function useBallot(id?: Address) {
  return api.ballot.get.useQuery({ id: String(id) }, { enabled: Boolean(id) });
}

export function useBallotWithMetadata(id?: Address) {
  const { data: ballotData, isLoading: isBallotLoading, isError: isBallotError, refetch: refetchBallot } = useBallot(id);

  const metadataData = useMetadata<ballotImpacts>(ballotData?.metadataPtr);
  const isMetadataLoading = !metadataData;
  const isMetadataError = metadataData instanceof Error;

  return {
    ballotData,
    metadataData,
    refetchBallot,
    isLoading: isBallotLoading || isMetadataLoading,
    isError: isBallotError || isMetadataError,
  };
}