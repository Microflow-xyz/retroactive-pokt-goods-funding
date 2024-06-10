import { api } from "~/utils/api";

export function useBallots(options: {
  refetchInterval: number | undefined;
}) {
  return api.results.ballots.useQuery(undefined, options);
}
