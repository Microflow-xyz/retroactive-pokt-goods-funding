import { z } from "zod";

const shelvesPercentageRange = {
  lowImpactProjects: { min: 0.4, max: 1 },
  mediumImpactProjects: { min: 0, max: 0.6 },
  highImpactProjects: { min: 0, max: 0.3 },
  highestImpactProjects: { min: 0, max: 0.1 },
};

const isBetween = function (value: number, min: number, max: number) {
  if (value >= min && value <= max) {
    return true;
  }

  return false;
};

export const BallotImpactsSchema = z
  .object({
    lowImpactProjects: z.array(z.string()),
    mediumImpactProjects: z.array(z.string()),
    highImpactProjects: z.array(z.string()),
    highestImpactProjects: z.array(z.string()),
  })
  .superRefine((val, ctx) => {
    const lowImpactProjectsCount = val.lowImpactProjects?.length ?? 0;
    const mediumImpactProjectsCount = val.mediumImpactProjects?.length ?? 0;
    const highImpactProjectsCount = val.highImpactProjects?.length ?? 0;
    const highestImpactProjectsCount = val.highestImpactProjects?.length ?? 0;
    const projectsCount =
      lowImpactProjectsCount +
      mediumImpactProjectsCount +
      highImpactProjectsCount +
      highestImpactProjectsCount;

    if (projectsCount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You should have at least 1 project in your ballot.",
        fatal: true,
        path: ["AT_LEAST_ONE"],
      });

      return z.NEVER;
    }

    const lowImpactProjectsPercentage = lowImpactProjectsCount / projectsCount;
    const mediumImpactProjectsPercentage =
      mediumImpactProjectsCount / projectsCount;
    const highImpactProjectsPercentage =
      highImpactProjectsCount / projectsCount;
    const highestImpactProjectsPercentage =
      highestImpactProjectsCount / projectsCount;

    if (
      !isBetween(
        highestImpactProjectsPercentage,
        shelvesPercentageRange.highestImpactProjects.min,
        shelvesPercentageRange.highestImpactProjects.max,
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "10% of the projects can be HIGHEST_EXTRA_IMPACT.",
        path: ["HIGHEST_EXTRA_IMPACT"],
      });
    }

    if (
      !isBetween(
        highImpactProjectsPercentage,
        shelvesPercentageRange.highImpactProjects.min,
        shelvesPercentageRange.highImpactProjects.max,
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "20% of your projects + unused upper shelf capacity can be HIGH_IMPACT.",
        path: ["HIGH_IMPACT"],
      });
    }

    if (
      !isBetween(
        mediumImpactProjectsPercentage,
        shelvesPercentageRange.mediumImpactProjects.min,
        shelvesPercentageRange.mediumImpactProjects.max,
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "30% of your projects + unused upper shelf capacity can be MEDIUM_EXTRA_IMPACT.",
        path: ["MEDIUM_EXTRA_IMPACT"],
      });
    }

    if (
      !isBetween(
        lowImpactProjectsPercentage,
        shelvesPercentageRange.lowImpactProjects.min,
        shelvesPercentageRange.lowImpactProjects.max,
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "40% of your projects + unused upper shelf capacity can be LOW_EXTRA_IMPACT.",
        path: ["LOW_EXTRA_IMPACT"],
      });
    }
  });

const RevokeBallotSchema = z.object({
  ballotId: z.string(),
});

export type ballotImpacts = z.infer<typeof BallotImpactsSchema>;
