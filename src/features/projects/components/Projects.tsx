import clsx from "clsx";
import Link from "next/link";
import { InfiniteLoading } from "~/components/InfiniteLoading";
import { useSearchProjects } from "../hooks/useProjects";
import { SortFilter } from "~/components/SortFilter";
import { ProjectItem } from "./ProjectItem";
import { useEffect, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import type { LoadingBarRef } from "react-top-loading-bar";
import { useFilter } from "~/features/filter/hooks/useFilter";

export function Projects() {
  const { orderBy, sortOrder, search } = useFilter();
  const projects = useSearchProjects();
  const LoadingStateRef = useRef<LoadingBarRef>(null);

  useEffect(() => {
    if (projects?.isLoading) {
      return LoadingStateRef?.current?.continuousStart();
    } else {
      return LoadingStateRef?.current?.complete();
    }
  }, [projects?.isLoading]);

  return (
    <div>
      <LoadingBar color="white" ref={LoadingStateRef} />
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
              <ProjectItem isLoading={isLoading} attestation={item} />
            </Link>
          );
        }}
      />
    </div>
  );
}
