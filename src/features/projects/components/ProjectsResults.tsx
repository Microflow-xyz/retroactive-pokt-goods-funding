import clsx from "clsx";
import Link from "next/link";

import { InfiniteLoading } from "~/components/InfiniteLoading";
import { useProjectsResults } from "~/hooks/useResults";
import { ProjectItem } from "./ProjectItem";

export function ProjectsResults() {
  const projects = useProjectsResults();

  return (
    <InfiniteLoading
      {...projects}
      renderItem={(item, { isLoading }) => {
        return (
          <Link
            key={item.id}
            href={`/projects/${item.id}`}
            className={clsx("relative", { ["animate-pulse"]: isLoading })}
          >
            <ProjectItem isLoading={isLoading} attestation={item} />
          </Link>
        );
      }}
    />
  );
}
