import clsx from "clsx";
import Link from "next/link";
import { InfiniteLoading } from "~/components/InfiniteLoading";
import { useSearchProjects } from "../hooks/useProjects";
import { getAppState } from "~/utils/state";
import { useResults } from "~/hooks/useResults";
import { SortFilter } from "~/components/SortFilter";
import { ProjectItem, ProjectItemAwarded } from "./ProjectItem";
import {useEffect, useRef} from "react";
import LoadingBar from 'react-top-loading-bar';
import type { LoadingBarRef } from 'react-top-loading-bar';

export function Projects() {
  const projects = useSearchProjects();
  const results = useResults();
  const LoadingStateRef = useRef<LoadingBarRef>(null)

  useEffect(()=>{
    if(projects?.isLoading) {
      return LoadingStateRef?.current?.continuousStart()
    } else {
      return LoadingStateRef?.current?.complete()
    }
  },[projects?.isLoading])

  return (
    <div>
      <LoadingBar color='white' ref={LoadingStateRef} />
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
