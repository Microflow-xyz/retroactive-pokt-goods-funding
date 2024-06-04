import clsx from "clsx";
import Link from "next/link";
import { InfiniteLoading } from "~/components/InfiniteLoading";
import { useSearchProjects } from "../hooks/useProjects";
import { getAppState } from "~/utils/state";
import { useResults } from "~/hooks/useResults";
import { SortFilter } from "~/components/SortFilter";
import { ProjectItem, ProjectItemAwarded } from "./ProjectItem";

export function Projects() {
  const projects = useSearchProjects();
  const results = useResults();

  return (
    <div>
      <SortFilter />

      <InfiniteLoading
        {...projects}
        renderItem={(item, { isLoading }) => {
          return (
            <Link
              key={item.id}
              href={`/projects/${item?.id}`}
              as={`/projects/${item?.id}`}
              prefetch
              className={clsx("relative", { ["animate-pulse"]: isLoading })}
            >
              {!results.isPending && getAppState() === "RESULTS" ? (
                <ProjectItemAwarded
                  amount={results.data?.projects?.[item.id]?.votes}
                />
              ) : null}
              <ProjectItem isLoading={isLoading} attestation={item} />
            </Link>
          );
        }}
      />
    </div>
  );
}
