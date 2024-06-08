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
      return fetchAttestations([eas.schemas.metadata], {
        where: {
          recipient: { in: [input.id] },
          ...createDataFilter("type", "bytes32", "ballot"),
        },
      }, input.transactionId).then(([attestation]) => {
        console.log("ballotRouter response:", attestation);
        if (!attestation) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return attestation;
      });
    }),
});