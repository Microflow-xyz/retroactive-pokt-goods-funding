import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  fetchAttestations,
  createDataFilter,
  createSearchFilter,
} from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { config, eas } from "~/config";
import { type Filter, FilterSchema } from "~/features/filter/types";
import { fetchMetadata } from "~/utils/fetchMetadata";

export const projectsRouter = createTRPCRouter({
  count: publicProcedure.query(async ({}) => {
    return fetchAttestations([eas.schemas.approval], {
      where: {
        attester: { in: config.admins },
        AND: [
          createDataFilter("type", "bytes32", "application"),
          createDataFilter("round", "bytes32", config.roundId),
        ],
      },
    }).then((attestations = []) => {
      // Handle multiple approvals of an application - group by refUID
      return {
        count: Object.keys(
          attestations.reduce((acc, x) => ({ ...acc, [x.refUID]: true }), {}),
        ).length,
      };
    });
  }),
  getAll: publicProcedure.query(async () => {
    const initialAttestations = await fetchAttestations([eas.schemas.approval], {
      where: {
        attester: { in: config.admins },
        ...createDataFilter("type", "bytes32", "application"),
      },
    });
    const approvedIds = initialAttestations
      .map(({ refUID }) => refUID)
      .filter(Boolean);
    const approvedProjects = await fetchAttestations([eas.schemas.metadata], {
      where: {
        id: { in: approvedIds },
      },
    });
    const activeApprovedProjects = approvedProjects.filter((att) => att.revoked === false);
    const refUIDs = activeApprovedProjects
      .filter(
        (item) =>
          item.refUID !==
          "0x0000000000000000000000000000000000000000000000000000000000000000"
      )
      .map((item) => item.refUID);
    const filteredData = activeApprovedProjects.filter((item) => !refUIDs.includes(item.id));
    return filteredData.map((attestation) => {
      return { id: attestation.id, name: attestation.name };
    });
  }),

  get: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input: { ids } }) => {
      if (!ids.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return fetchAttestations([eas.schemas.metadata], {
        where: { id: { in: ids } },
      });
    }),
  search: publicProcedure.input(FilterSchema).query(async ({ input }) => {
    const filters = [
      createDataFilter("type", "bytes32", "application"),
      createDataFilter("round", "bytes32", config.roundId),
    ];

    if (input.search) {
      filters.push(createSearchFilter(input.search));
    }

    return fetchAttestations([eas.schemas.approval], {
      where: {
        attester: { in: config.admins },
        ...createDataFilter("type", "bytes32", "application"),
      },
    }).then((attestations = []) => {
      const approvedIds = attestations
        .map(({ refUID }) => refUID)
        .filter(Boolean);

      return fetchAttestations([eas.schemas.metadata], {
        take: input.limit,
        skip: input.cursor * input.limit,
        orderBy: [createOrderBy(input.orderBy, input.sortOrder)],
        where: {
          id: { in: approvedIds },
          AND: filters,
        },
      });
    });
  }),

  // Used for distribution to get the projects' payoutAddress
  // To get this data we need to fetch all projects and their metadata
  payoutAddresses: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input }) => {
      console.log({ input });
      return fetchAttestations([eas.schemas.metadata], {
        where: { id: { in: input.ids } },
      })
        .then((attestations) =>
          Promise.all(
            attestations.map((attestation) =>
              fetchMetadata(attestation.metadataPtr).then((data) => {
                const { payoutAddress } = data as unknown as {
                  payoutAddress: string;
                };

                console.log({ payoutAddress });
                return { projectId: attestation.id, payoutAddress };
              }),
            ),
          ),
        )
        .then((projects) =>
          projects.reduce(
            (acc, x) => ({ ...acc, [x.projectId]: x.payoutAddress }),
            {},
          ),
        );
    }),
    ids: publicProcedure.input(FilterSchema).query(async ({ input }) => {
      const filters = [
        createDataFilter("type", "bytes32", "application"),
        createDataFilter("round", "bytes32", config.roundId),
      ];
      if (input.search) {
        filters.push(createSearchFilter(input.search));
      }
      
      const initialAttestations = await fetchAttestations([eas.schemas.approval], {
        where: {
          attester: { in: config.admins },
          ...createDataFilter("type", "bytes32", "application"),
        },
      });
      const approvedIds = initialAttestations
        .map(({ refUID }) => refUID)
        .filter(Boolean);
        
      const approvedProjects = await fetchAttestations([eas.schemas.metadata], {
        orderBy: [createOrderBy(input.orderBy, input.sortOrder)],
        where: {
          id: { in: approvedIds },
          AND: filters,
        },
      });
      
      const activeApprovedProjects = approvedProjects.filter((att) => att.revoked === false);
      const refUIDs = activeApprovedProjects
        .filter(
          (item) =>
            item.refUID !==
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        )
        .map((item) => item.refUID);
      const filteredData = activeApprovedProjects.filter((item) => !refUIDs.includes(item.id));
      
      return filteredData.map((attestation) => attestation.id);
    }),
});

function createOrderBy(
  orderBy: Filter["orderBy"],
  sortOrder: Filter["sortOrder"],
) {
  const key = {
    time: "time",
    name: "decodedDataJson",
  }[orderBy];

  return { [key]: sortOrder };
}
