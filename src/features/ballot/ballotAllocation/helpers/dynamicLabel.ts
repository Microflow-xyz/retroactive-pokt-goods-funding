export const dynamicLabel = (input, missing) => {
  const message = {
    highestImpactProjects: {},
    highImpactProjects: {},
    mediumImpactProjects: {},
    lowImpactProjects: {},
  };
  // highest
  if (missing.highest == 0) {
    message.highestImpactProjects = {
      type: "info",
      text: "Can add more projects (up to 10% of total projects)",
    };
  } else if (missing.highest > 0 && input.highest == 0) {
    message.highestImpactProjects = {
      type: "error",
      text: `Add ${missing.highest} projects`,
    };
  } else if (missing.highest > 0 && input.highest > 0) {
    message.highestImpactProjects = {
      type: "error",
      text: `Add ${missing.highest} more projects`,
    };
  }
  // high
  if (missing.highest == 0 && missing.high == 0) {
    message.highImpactProjects = {
      type: "info",
      text: "Can add more projects (up to 20% of total projects)",
    };
  } else if (missing.highest > 0 && missing.high == 0) {
    message.highImpactProjects = {
      type: "info",
      text: "Can use the extra capacity of higher tiers",
    };
  } else if (missing.high > 0 && input.high == 0) {
    message.highImpactProjects = {
      type: "error",
      text: `Add ${missing.high} more projects to this tier or another tier below.`,
    };
  } else if (missing.high > 0 && input.high > 0) {
    message.highImpactProjects = {
      type: "error",
      text: `Add ${missing.high} more projects to this tier or another tier below.`,
    };
  }
  // mid
  if (missing.highest == 0 && missing.high == 0 && missing.mid == 0) {
    message.mediumImpactProjects = {
      type: "info",
      text: "Can add more projects (up to 30% of total projects)",
    };
  } else if ((missing.highest > 0 || missing.high > 0) && missing.mid == 0) {
    message.mediumImpactProjects = {
      type: "info",
      text: "Can use the extra capacity of higher tiers",
    };
  } else if (missing.mid > 0 && input.mid == 0) {
    message.mediumImpactProjects = {
      type: "error",
      text: `Add ${missing.mid} more projects to this tier or another tier below.`,
    };
  } else if (missing.mid > 0 && input.mid > 0) {
    message.mediumImpactProjects = {
      type: "error",
      text: `Add ${missing.mid} more projects to this tier or another tier below.`,
    };
  }
  // low
  if (
    missing.highest == 0 &&
    missing.high == 0 &&
    missing.mid == 0 &&
    missing.low == 0
  ) {
    message.lowImpactProjects = {
      type: "info",
      text: "Can add more projects (up to 40% of total projects)",
    };
  } else if (
    (missing.highest > 0 || missing.high > 0 || missing.mid > 0) &&
    missing.low == 0
  ) {
    message.lowImpactProjects = {
      type: "info",
      text: "Can use the extra capacity of higher tiers",
    };
  } else if (missing.low > 0 && input.low == 0) {
    message.lowImpactProjects = {
      type: "error",
      text: `Add ${missing.low} more projects to this tier or another tier below.`,
    };
  } else if (missing.low > 0 && input.low > 0) {
    message.lowImpactProjects = {
      type: "error",
      text: `Add ${missing.low} more projects to this tier or another tier below.`,
    };
  }
  return message;
};
