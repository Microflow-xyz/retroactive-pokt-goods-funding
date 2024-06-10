import { type Address } from "viem";
import { api } from "~/utils/api";
import { useMetadata } from "./useMetadata";
import { type ballotImpacts } from "~/features/ballot/types";
import { metadata } from "~/config";

export function useBallot(id?: Address, transactionId?: string) {
  const { data, isLoading, isError, refetch } = api.ballot.get.useQuery(
    { id: String(id), transactionId },
    { enabled: Boolean(id) }
  );

  return {
    ballotData: data,
    isLoading,
    isError: isError || data instanceof Error,
    refetchBallot: refetch,
  };
}

export function useBallotWithMetadata(id?: Address, transactionId?: string) {
  const {
    ballotData,
    isLoading: isBallotLoading,
    isError: isBallotError,
    refetch: refetchBallot,
  } = useBallot(id, transactionId);
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
