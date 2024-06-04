import React, { useMemo, useState } from "react";
import { useSearchProjects } from "~/features/projects/hooks/useProjects";
import { type Attestation } from "~/utils/fetchAttestations";
import { type ballotImpacts, type projectSchema } from "../types";
import { useApplications } from "~/features/applications/hooks/useApplications";
import { useApprovedApplications } from "~/features/applications/hooks/useApprovedApplications";

import { Input } from "~/components/ui/Form";
import { useDrop } from "react-dnd";
import ProjectItem from "./ProjectItem";
import DropTargetAccordion from "./DropTargetAccordion";

//FIXME: This is modal should be removed
function BallotAllocation({
  droppedItems,
  setDroppedItems,
  isModal,
  projectName,
}: {
  droppedItems: ballotImpacts;
  setDroppedItems: React.Dispatch<React.SetStateAction<ballotImpacts>>;
  isModal: boolean;
  projectName?: string;
}) {
  // const projects = useSearchProjects();

  const applications = useApplications();
  const approved = useApprovedApplications();

  const approvedById = useMemo(
    () =>
      approved.data?.reduce(
        (map, x) => (map.set(x.refUID, true), map),
        new Map<string, boolean>(),
      ),
    [approved.data],
  );

  const approvedProjects = applications.data?.filter((application) =>
    approvedById?.get(application.id),
  );

  const refUIDs: string[] | undefined = approvedProjects
    ?.filter(
      (item) =>
        item.refUID !==
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    )
    .map((item) => item.refUID);

    const filteredData = approvedProjects?.filter((item) => !refUIDs?.includes(item.id));
    console.log("filteredData", filteredData);


  const allProjects = filteredData?.filter((project) => {
    for (let shelve in droppedItems) {
      if (
        droppedItems[shelve]?.findIndex((item) => item?.id === project.id) !==
        -1
      ) {
        return false; // Exclude this project from the filtered array
      }
    }
    return true; // Include this project in the filtered array
  });

  const [searchTerm, setSearchTerm] = useState(projectName ?? "");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredProjects = useMemo(() => {
    return allProjects?.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allProjects, searchTerm]);

  const [{ isOverApplicationPool }, dropApplicationPool] = useDrop(() => {
    return {
      accept: "ITEM",
      drop: (item) => {
        setDroppedItems((prevDroppedItems) => {
          for (let shelve in prevDroppedItems) {
            if (
              prevDroppedItems[shelve]?.findIndex((i) => i.id === item.id) !==
              -1
            ) {
              return {
                ...prevDroppedItems,
                [shelve]: prevDroppedItems[shelve].filter(
                  (i) => i.id !== item.id,
                ),
              };
            }
          }
          return prevDroppedItems;
        });
      },
      collect: (monitor) => ({
        isOverApplicationPool: monitor.isOver(),
      }),
    };
  });

  return (
    <div
      className={`${!isModal && "mt-16 flex"} items-baseline justify-between gap-5`}
    >
      <div
        className={`flex ${isModal ? "w-full" : "w-1/2"} flex-col justify-between gap-3`}
      >
        <h4 className="text-base font-semibold">
          Application Pool ({allProjects?.length})
        </h4>
        <div
          ref={dropApplicationPool}
          className={`flex flex-col items-center gap-6 rounded-xl border border-outline-dark  p-5 ${
            isOverApplicationPool
              ? " bg-inverseSurface-light"
              : "bg-onBackground-dark"
          }`}
        >
          <Input
            placeholder="Search among projects"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div
            className={`flex min-h-10 w-full flex-wrap gap-2 rounded-lg p-1`}
          >
            {filteredProjects?.map((project, index) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
      <div
        className={`flex ${isModal ? "mt-3 w-full" : "w-1/2"} flex-col justify-between gap-3`}
      >
        <h4 className="text-base font-semibold">Impact Tiers</h4>

        <div className="rounded-xl border border-outline-dark bg-onBackground-dark">
          <DropTargetAccordion
            shelveName="highestImpactProjects"
            label={`Highest Impact`}
            setDroppedItems={setDroppedItems}
            droppedItems={droppedItems}
            className="border-b border-outline-dark"
          />

          <DropTargetAccordion
            shelveName="highImpactProjects"
            label={`High Impact`}
            setDroppedItems={setDroppedItems}
            droppedItems={droppedItems}
            className="border-b border-outline-dark"
          />

          <DropTargetAccordion
            shelveName="mediumImpactProjects"
            label={`Medium Impact`}
            setDroppedItems={setDroppedItems}
            droppedItems={droppedItems}
            className="border-b border-outline-dark"
          />

          <DropTargetAccordion
            shelveName="lowImpactProjects"
            label={`Low Impact`}
            setDroppedItems={setDroppedItems}
            droppedItems={droppedItems}
          />
        </div>
      </div>
    </div>
  );
}

export default BallotAllocation;
