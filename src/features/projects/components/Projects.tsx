import clsx from "clsx";
import Link from "next/link";
import { InfiniteLoading } from "~/components/InfiniteLoading";
import { useSearchProjects } from "../hooks/useProjects";
import { getAppState } from "~/utils/state";
import { useResults } from "~/hooks/useResults";
import { SortFilter } from "~/components/SortFilter";
import { ProjectItem, ProjectItemAwarded } from "./ProjectItem";
import { useFilter } from "~/features/filter/hooks/useFilter";

export function Projects() {
  const { orderBy, sortOrder, search } = useFilter();
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
              href={`/projects/${item?.id}?search=${search}&orderBy=${orderBy}&sortOrder=${sortOrder}`}
              as={`/projects/${item?.id}?search=${search}&orderBy=${orderBy}&sortOrder=${sortOrder}`}
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
