import { useAttest, useCreateAttestation } from "~/hooks/useEAS";
import { useMutation } from "@tanstack/react-query";
import { useUploadMetadata } from "~/hooks/useMetadata";
import { config, eas } from "~/config";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { toast } from "sonner";
import { type BallotImpacts } from "../../types";
import { type TransactionError } from "~/features/voters/hooks/useApproveVoters";

export function useSubmitBallot({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (err: TransactionError) => void;
}) {
  const attest = useAttest();
  const signer = useEthersSigner();
  const upload = useUploadMetadata();
  const attestation = useCreateAttestation();

  return useMutation({
    mutationFn: async (values: {
      voterId: string;
      impacts: BallotImpacts;
    }) => {
      if (!signer) throw new Error("Connect wallet first");

      const attestations = await Promise.all([
        upload.mutateAsync(values.ballot).then(({ url: metadataPtr }) => {
          console.log("Creating ballot attestation data");
          return attestation.mutateAsync({
            schemaUID: eas.schemas.ballot,
            values: {
              metadataType: 0, // "http"
              metadataPtr,
              type: "ballot",
              round: config.roundId,
            },
          });
        }),
      ]);
      return attest.mutateAsync(
        attestations.map((att) => ({ ...att, data: [att.data] })),
      );
    },
    onSuccess,
    onError,
  });
}
