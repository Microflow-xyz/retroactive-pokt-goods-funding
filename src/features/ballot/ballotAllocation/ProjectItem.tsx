import React from "react";
import Link from "next/link";
import { useDrag } from "react-dnd";
import { type Attestation } from "~/utils/fetchAttestations";
import { ExternalLinkIcon } from "lucide-react";

const ProjectItem = React.memo(
  ({ project }: { project: { id: number; name: string } }) => {
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
        className={`${isDragging ? " opacity-50" : " opacity-100"} flex cursor-pointer items-center gap-1 rounded-lg border border-onPrimary-light px-3 py-2 text-sm font-medium`}
      >
        {project.name}
        <Link
          href={`/projects/${project?.id}`}
          as={`/projects/${project?.id}`}
          target="_blank"
        >
          <ExternalLinkIcon className=" h-4 w-4" />
        </Link>
      </div>
    );
  },
);

export default ProjectItem;
