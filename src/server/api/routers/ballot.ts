import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eas } from "~/config";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchAttestations, createDataFilter } from "~/utils/fetchAttestations";

export const ballotRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string(), transactionId: z.string().optional() }))
    .query(async ({ input }) => {
      console.log("ballotRouter called with:", input);
      const [attestation] = await fetchAttestations(
        [eas.schemas.metadata],
        {
          where: {
            recipient: { in: [input.id] },
            ...createDataFilter("type", "bytes32", "ballot"),
          },
          orderBy: [{ time: "desc" }],
        },
        input.transactionId,
      );

      console.log("ballotRouter response:", attestation);

      if (!attestation) {
        return null; // or return an empty object, depending on your requirements
      }

      return attestation;
    }),
});
