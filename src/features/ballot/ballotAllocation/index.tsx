import React, { useMemo, useState } from "react";
import { useSearchProjects } from "~/features/projects/hooks/useProjects";
import { type Attestation } from "~/utils/fetchAttestations";
import { type ballotImpacts, type projectSchema } from "../types";
import { Input } from "~/components/ui/Form";
import { useDrop } from "react-dnd";
import ProjectItem from "./ProjectItem";
import DropTargetAccordion from "./DropTargetAccordion";

//FIXME: This is modal should be removed
function BallotAllocation({
  droppedItems,
  setDroppedItems,
  isModal,
}: {
  droppedItems: ballotImpacts;
  setDroppedItems: React.Dispatch<React.SetStateAction<ballotImpacts>>;
  isModal: boolean;
}) {
  // const projects = useSearchProjects();
  const projects: projectSchema[] = [
    { id: 1, name: "project1" },
    { id: 2, name: "project2" },
    { id: 3, name: "project3" },
    { id: 4, name: "project4" },
    { id: 5, name: "project5" },
    { id: 6, name: "project6" },
    { id: 7, name: "project7" },
    { id: 8, name: "project8" },
    { id: 9, name: "project9" },
    { id: 10, name: "project10" },
    { id: 11, name: "project11" },
    { id: 12, name: "project12" },
    { id: 13, name: "project13" },
    { id: 14, name: "project14" },
    { id: 15, name: "project15" },
    { id: 16, name: "project16" },
  ];
  const allProjects = projects.filter((project) => {
    for (let shelve in droppedItems) {
      if (
        droppedItems[shelve]?.findIndex((item) => item.id === project.id) !== -1
      ) {
        return false; // Exclude this project from the filtered array
      }
    }
    return true; // Include this project in the filtered array
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  console.log("droppedItems", Object.values(droppedItems).flat());

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) =>
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
        <div className="flex flex-col items-center gap-6 rounded-xl border border-outline-dark bg-onBackground-dark p-5">
          <Input
            placeholder="Search among projects"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div
            ref={dropApplicationPool}
            className={`flex min-h-10 w-full flex-wrap gap-2 rounded-lg p-1 ${
              isOverApplicationPool ? " bg-inverseSurface-light" : ""
            }`}
          >
            {filteredProjects.map((project, index) => (
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
