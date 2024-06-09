import { useAttest, useCreateAttestation } from "~/hooks/useEAS";
import { useMutation } from "@tanstack/react-query";
import { useUploadMetadata } from "~/hooks/useMetadata";
import { config, eas } from "~/config";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { toast } from "sonner";
import { type ballotImpacts } from "../types";
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
  const mutation =  useMutation({
    mutationFn: async (values: { impacts: ballotImpacts }) => {
      if (!signer) throw new Error("Connect wallet first");

      const attestations = await Promise.all([
        upload.mutateAsync(values.impacts).then(({ url: metadataPtr }) => {
          return attestation.mutateAsync({
            schemaUID: eas.schemas.metadata,
            values: {
              name: "ballot attestation",
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
  return {
    ...mutation,
    error: attest.error ?? upload.error ?? mutation.error,
    isAttesting: attest.isPending,
    isUploading: upload.isPending,
  };
}
