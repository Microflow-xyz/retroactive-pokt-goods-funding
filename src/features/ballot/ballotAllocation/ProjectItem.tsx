import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Link from "next/link";
import { useDrag } from "react-dnd";
import { type Attestation } from "~/utils/fetchAttestations";
import { X, ExternalLinkIcon } from "lucide-react";

const ProjectItem = React.memo(
  ({
    project,
    onDelete,
  }: {
    project: { id: number; name: string };
    onDelete?: () => void;
  }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "ITEM",
      item: project,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <>
        <div
          data-tooltip-id={project?.id.toString()}
          ref={drag}
          className={`${isDragging ? " opacity-50" : " opacity-100"} flex cursor-pointer items-center gap-1 rounded-lg border border-onPrimary-light px-3 py-2 text-sm font-medium`}
        >
          {onDelete && (
            <button onClick={() => onDelete()}>
              <X color="#ffffff" className="h-4 w-4" />
            </button>
          )}
          <p className="max-w-24 truncate"> {project.name}</p>

          <Link
            href={`/projects/${project?.id}`}
            as={`/projects/${project?.id}`}
            target="_blank"
          >
            <ExternalLinkIcon className=" h-4 w-4" />
          </Link>
        </div>
        <ReactTooltip
          id={project?.id.toString()}
          place="bottom"
          className="bg-background-dark bg-opacity-100 text-onSurfaceVariant-dark shadow-sm text-sm font-normal"
          content={project.name}
          style={{ backgroundColor: "#231f20" }}
        />
      </>
    );
  },
);

export default ProjectItem;
