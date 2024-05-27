import React from "react";
import { useDrag } from "react-dnd";
import { type Attestation } from "~/utils/fetchAttestations";

const ProjectItem = React.memo(({ project }: { project: Attestation }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ITEM",
    item: project,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`${isDragging ? " opacity-50" : " opacity-100"} rounded-lg border border-onPrimary-light px-3 py-2 text-sm font-medium`}
    >
      {project.name}
    </div>
  );
});

export default ProjectItem;
