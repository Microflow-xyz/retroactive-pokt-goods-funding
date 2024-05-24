import React from "react";
import { useSearchProjects } from "~/features/projects/hooks/useProjects";
import { DndProvider, useDrag, useDrop } from "react-dnd";

function BallotAllocation() {
  const projects = useSearchProjects();
  const allProjects =
    projects?.data?.pages && [].concat(...projects?.data?.pages);
  console.log(
    "projects",
    projects?.data?.pages && [].concat(...projects?.data?.pages),
  );
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ITEM",
    item: { id: "unique-id" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div className="flex justify-between gap-3">
      <h4 className="text-base font-semibold">Application Pool(12)</h4>
      <div>
        <input />
        <div>
          {allProjects?.map((project) => (
            <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
              Drag me!
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BallotAllocation;
