import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { config } from "~/config";

export const votersRouter = createTRPCRouter({
  list: publicProcedure.query(async ({}) => {
    return config.voters;
  }),
});
