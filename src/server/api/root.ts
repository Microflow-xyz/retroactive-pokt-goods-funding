import { configRouter } from "~/server/api/routers/config";
import { resultsRouter } from "~/server/api/routers/results";
import { projectsRouter } from "~/server/api/routers/projects";
import { metadataRouter } from "~/server/api/routers/metadata";
import { applicationsRouter } from "~/server/api/routers/applications";
import { profileRouter } from "~/server/api/routers/profile";
import { ballotRouter } from "~/server/api/routers/ballot";
import { listsRouter } from "~/server/api/routers/lists";
import { createTRPCRouter } from "~/server/api/trpc";
import { discussionRouter } from "~/server/api/routers/discussion";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  config: configRouter,
  results: resultsRouter,
  lists: listsRouter,
  applications: applicationsRouter,
  profile: profileRouter,
  ballot: ballotRouter,
  metadata: metadataRouter,
  projects: projectsRouter,
  discussion: discussionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
