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
      text: `Add 0-${missing.highest} projects`,
    };
  } else if (missing.highest > 0 && input.highest > 0) {
    message.highestImpactProjects = {
      type: "error",
      text: `Add 0-${missing.highest} more projects`,
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
      text: "Can use the extra capacity from the upper shelves",
    };
  } else if (missing.high > 0 && input.high == 0) {
    message.highImpactProjects = {
      type: "error",
      text: `Add 0-${missing.high} projects (Can use extra capacity from upper shelves)`,
    };
  } else if (missing.high > 0 && input.high > 0) {
    message.highImpactProjects = {
      type: "error",
      text: `Add 0-${missing.high} more projects (Can use extra capacity from upper shelves)`,
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
      text: "Can use the extra capacity from the upper shelves",
    };
  } else if (missing.mid > 0 && input.mid == 0) {
    message.mediumImpactProjects = {
      type: "error",
      text: `Add 0-${missing.mid} projects (Can use extra capacity from upper shelves)`,
    };
  } else if (missing.mid > 0 && input.mid > 0) {
    message.mediumImpactProjects = {
      type: "error",
      text: `Add 0-${missing.mid} more projects (Can use extra capacity from upper shelves)`,
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
      text: "Can use the extra capacity from the upper shelves",
    };
  } else if (missing.low > 0 && input.low == 0) {
    message.lowImpactProjects = {
      type: "error",
      text: `Add 0-${missing.low} projects (Can use extra capacity from upper shelves)`,
    };
  } else if (missing.low > 0 && input.low > 0) {
    message.lowImpactProjects = {
      type: "error",
      text: `Add 0-${missing.low} more projects (Can use extra capacity from upper shelves)`,
    };
  }
  return message;
};
